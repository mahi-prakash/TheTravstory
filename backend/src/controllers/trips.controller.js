const supabase = require('../config/db');
const logger = require('../utils/logger');

// Create a new trip
const createTrip = async (req, res, next) => {
  try {
    const { title, destination, start_date, image } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('trips')
      .insert([{ title, destination, start_date, image, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Trip created by user ${userId}`);
    res.status(201).json({ trip: data });
  } catch (error) {
    next(error);
  }
};

// Get all trips for the logged-in user
const getTrips = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ trips: data });
  } catch (error) {
    next(error);
  }
};

// Get a single trip by ID
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Trip not found' });

    res.status(200).json({ trip: data });
  } catch (error) {
    next(error);
  }
};

// Update a trip
const updateTrip = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, destination, start_date, itinerary, ai_itinerary, image } = req.body;

  try {
    // 1. Fetch current trip to check if ai_itinerary is already set
    const { data: trip } = await supabase
      .from('trips')
      .select('ai_itinerary')
      .eq('id', id)
      .single();

    const updatePayload = { title, destination, start_date, itinerary, ai_itinerary, image };

    // 2. Product Rule: If this is the first itinerary ever saved, 
    // it's the "AI Plan". Save it to ai_itinerary too.
    if (itinerary && (!trip || !trip.ai_itinerary)) {
      updatePayload.ai_itinerary = itinerary;
      logger.info(`💾 Initial AI Plan preserved for Trip ${id}`);
    }

    const { data, error } = await supabase
      .from('trips')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ trip: data });
  } catch (error) {
    logger.error('UPDATE_TRIP_ERROR:', error);
    next(error);
  }
};

// Delete a trip
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    logger.info(`Trip ${id} deleted by user ${userId}`);
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip };