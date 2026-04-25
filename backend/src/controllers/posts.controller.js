const supabase = require('../config/db');

// Mock data as fallback while tables are being created
const MOCK_POSTS = [
    {
        id: "mock-1",
        image_url: "/place1.jpg",
        location: "Kyoto, Japan",
        author: "@nomad_jess",
        caption: "Found the hidden shrine behind the bamboo forest. Literally zen. #hiddenjapan #kyoto",
        category: "gems"
    },
    {
        id: "mock-2",
        image_url: "/place2.jpg",
        location: "Osaka, Japan",
        author: "@foodie_sam",
        caption: "Street food heaven 🍜🔥 #osaka #foodtrip",
        category: "food"
    },
    {
        id: "mock-3",
        image_url: "/place3.webp",
        location: "Tokyo, Japan",
        author: "@citywalks",
        caption: "Neon nights never disappoint 🌃 #tokyo",
        category: "scenic"
    }
];

const getPosts = async (req, res, next) => {
    try {
        const { category, mood } = req.query;
        
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data: posts, error } = await query;

        // If the table doesn't exist yet, error will have code '42P01' (undefined_table)
        // We fallback to mock data to keep the UI working
        if (error) {
            console.warn("Supabase posts error (falling back to mock data):", error.message);
            
            // Basic filtering on mock data
            let filteredMocks = MOCK_POSTS;
            if (category && category !== 'all') {
                 filteredMocks = MOCK_POSTS.filter(p => p.category === category);
            }
            
            return res.json({ success: true, data: filteredMocks, isMock: true });
        }

        res.json({ success: true, data: posts, isMock: false });
    } catch (error) {
        next(error);
    }
};

const recordInteraction = async (req, res, next) => {
    try {
        const { post_id, interaction_type } = req.body;
        const user_id = req.user ? req.user.id : null; // Assuming some auth middleware might exist later

        // For MVP, if no user is authenticated, we can optionally skip or log anonymous
        if (!user_id) {
             return res.json({ success: true, message: "Interaction ignored (no user)" });
        }

        const { data, error } = await supabase
            .from('post_interactions')
            .insert([{ user_id, post_id, interaction_type }]);

        if (error) {
            console.warn("Interaction table error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    recordInteraction
};
