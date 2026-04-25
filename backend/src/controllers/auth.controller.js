const supabase = require('../config/db')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

const register = async (req, res) => {
    try {
        const { email, name, password } = req.body

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered!' })
        }

        // Save user in database
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ email, name }])
            .select()
            .single()

        if (error) throw error

        const token = generateToken(newUser)

        logger.info(`New user registered: ${email}`)
        res.status(201).json({ user: newUser, token })

    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ message: 'Something went wrong!' })
    }
}

const login = async (req, res) => {
    try {
        const { email } = req.body

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (!user) {
            return res.status(404).json({ message: 'User not found!' })
        }

        const token = generateToken(user)

        logger.info(`User logged in: ${email}`)
        res.json({ user, token })

    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ message: 'Something went wrong!' })
    }
}

const getMe = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single()

        if (error) throw error

        res.json({ user })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ message: 'Something went wrong!' })
    }
}

    const googleLogin = async (req, res) => {
    try {
        const { id, email, name, picture } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required!' });
        }

        // Check if user exists
        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        // If user doesn't exist, register them
        if (!user) {
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([{ id, email, name }])
                .select()
                .single();

            if (error) throw error;
            user = newUser;
            logger.info(`New user registered via Google: ${email}`);
        } else {
            logger.info(`User logged in via Google: ${email}`);
        }

        // We can optionally save the picture URL if the users table supports it.
        // For now, we'll just log them in using the custom JWT system.

        const token = generateToken(user);
        res.json({ user, token });

    } catch (error) {
        logger.error('Google Login Error: ' + error.message);
        res.status(500).json({ message: 'Something went wrong during Google Login!' });
    }
}

const saveQuiz = async (req, res, next) => {
    try {
        const { personality, preferences, rawAnswers } = req.body;
        const userId = req.user.id;

        const { error } = await supabase
            .from('users')
            .update({
                quiz_completed: true,
                personality: personality,
                raw_quiz_data: rawAnswers || {},
                nature_score: preferences?.nature || 0,
                social_score: preferences?.social || 0,
                adventure_score: preferences?.adventure || 0,
                relaxation_score: preferences?.relaxation || 0,
                culture_score: preferences?.culture || 0,
                urban_score: preferences?.urban || 0,
                budget_score: preferences?.budget || 0
            })
            .eq('id', userId);

        if (error) throw error;

        res.status(200).json({ message: 'Quiz saved successfully' });
    } catch (error) {
        next(error);
    }
};
module.exports = { register, login, getMe, saveQuiz, googleLogin };