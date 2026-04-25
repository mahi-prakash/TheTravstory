const Groq = require('groq-sdk');
const supabase = require('../config/db');
const logger = require('../utils/logger');

// ─── Groq Load Balancer Setup ───────────────────────────────────────────────
const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
  process.env.GROQ_API_KEY_6,
  process.env.GROQ_API_KEY_7,
  process.env.GROQ_API_KEY_8,
  process.env.GROQ_API_KEY_9,
].filter(key => key && !key.includes('YOUR_GROQ_KEY')); // Only use real keys

// Initialize multiple clients
const groqClients = groqKeys.map(key => new Groq({ apiKey: key }));
let currentClientIndex = 0;

/**
 * Get the next available Groq client (Round Robin)
 */
const getNextGroqClient = () => {
  if (groqClients.length === 0) {
    throw new Error("No valid Groq API keys found in .env");
  }
  const client = groqClients[currentClientIndex];
  logger.info(`🔄 Using Groq Key #${currentClientIndex + 1} for this request`);
  currentClientIndex = (currentClientIndex + 1) % groqClients.length;
  return client;
};

const sendMessage = async (req, res, next) => {
  try {
    const { tripId, content } = req.body;
    const userId = req.user.id;

    // 1. Fetch trip context directly (THE SOURCE OF TRUTH)
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      logger.error('Trip context not found');
      return res.status(404).json({ message: 'Trip not found. Please create a trip first.' });
    }

    const destination = trip.destination || 'Unknown';

    // 2. Save user message
    const { error: saveError } = await supabase
      .from('messages')
      .insert([{ trip_id: tripId, user_id: userId, role: 'user', content }]);

    if (saveError) throw saveError;

    // 3. Fetch history
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;

    const systemPrompt = `
You are an ELITE Travel Planning Engine for Mahi. 
Destination: ${destination}.

Rules:
1. Itinerary must be exactly for the requested trip length.
2. Day 1: Flight, Transport, Hotel Check-in. Last Day: Hotel Checkout, Return Travel.
3. Hotels: title, location, price_range (₹), booking_hint. Show ONLY on check-in day.
4. Transport: mode, route, cost (₹). 
5. Geography: Group by area, minimize travel time.
6. Allowed types: [SIGHTSEEING, FOOD, HOTEL, ACTIVITY, TRANSPORT, FLIGHT].
7. JSON: Strictly follow the format inside [ITINERARY] tags.

Format:
[ITINERARY]
{
  "destination": "${destination}",
  "days": [{
      "day": 1,
      "activities": [
        { "time": "10:00", "type": "FLIGHT", "title": "Arrival", "location": "Airport" },
        { "time": "11:30", "type": "TRANSPORT", "title": "Cab", "location": "Airport to Hotel", "price_range": "₹500" },
        { "time": "13:00", "type": "HOTEL", "title": "Hotel", "location": "Area", "price_range": "₹5000", "booking_hint": "Nice view" }
      ]
  }]
}
[/ITINERARY]

Response Rules:
1. If asked for a plan/itinerary: Friendly greeting to Mahi, 2-4 lines of travel insights, brief "Trip Flow" reasoning, then the [ITINERARY] block.
2. If just chatting/asking questions: Talk normally and helpfully without the [ITINERARY] block.
3. Keep all responses concise to save tokens.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map((msg) => {
        // 🔥 TOKEN OPTIMIZATION: Strip large JSON blocks from history
        // The AI doesn't need to see the raw JSON it generated 5 messages ago.
        let content = msg.content;
        if (msg.role === "assistant") {
          content = content.replace(/\[ITINERARY\][\s\S]*?\[\/ITINERARY\]/gi, " (Itinerary data omitted for brevity) ");
        }
        
        return {
          role: msg.role === "assistant" ? "assistant" : "user",
          content: content,
        };
      })
    ];

    const selectedGroq = getNextGroqClient();
    const response = await selectedGroq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 3000,
      temperature: 0.2,
    });

    const aiReply = response.choices[0].message.content;

    await supabase
      .from('messages')
      .insert([{ trip_id: tripId, user_id: userId, role: 'assistant', content: aiReply }]);

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('CHAT_ERROR:', error);
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { trip_id } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('trip_id', trip_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({ messages: data });
  } catch (error) {
    next(error);
  }
};

const saveOnlyMessage = async (req, res, next) => {
  try {
    const { tripId, content, role } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ trip_id: tripId, user_id: userId, role: role || 'user', content }])
      .select();

    if (error) {
      logger.error('SAVE_ONLY_ERROR:', error);
      throw error;
    }

    res.status(201).json({ message: 'Saved successfully', data });
  } catch (error) {
    logger.error('SAVE_ONLY_CATCH:', error);
    next(error);
  }
};

module.exports = { sendMessage, getMessages, saveOnlyMessage };