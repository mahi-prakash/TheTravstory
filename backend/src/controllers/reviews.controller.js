const supabase = require('../config/db');
const logger = require('../utils/logger');

const submitReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { place_id, trip_id, rating, facility_quality, budget_friendly, personal_experience, review_text, place_category, place_name } = req.body;

        // 1. Ensure the place exists in the places table (Upsert)
        // This satisfies the relational integrity constraint we just added!
        const { error: placeError } = await supabase
            .from('places')
            .upsert([{
                id: place_id,
                name: place_name || place_category || 'Unknown Place',
                category: place_category,
                added_by: userId
            }], { onConflict: 'id' });
            
        if (placeError) {
            logger.warn(`Failed to upsert place ${place_id}, but continuing... ${placeError.message}`);
        }

        // 2. Insert the review into the reviews table
        const { data: reviewData, error: reviewError } = await supabase
            .from('place_reviews')
            .insert([{
                user_id: userId,
                place_id,
                trip_id,
                rating,
                facility_quality,
                budget_friendly,
                personal_experience,
                review_text
            }])
            .select()
            .single();

        if (reviewError) throw reviewError;

        res.status(201).json({ success: true, review: reviewData });
    } catch (error) {
        logger.error(`Review submission error: ${error.message}`);
        next(error);
    }
};

const getTripReviews = async (req, res, next) => {
    try {
        const { trip_id } = req.params;
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('place_reviews')
            .select('*')
            .eq('trip_id', trip_id)
            .eq('user_id', userId);

        if (error) throw error;

        res.status(200).json({ success: true, reviews: data });
    } catch (error) {
        next(error);
    }
};

module.exports = { submitReview, getTripReviews };
