import bcrypt from 'bcryptjs'; // use bcryptjs
import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';

// Generate JWT token
const generateToken = (id) => {
    const jwtSecret = 'thisIsTheSceretCodeForTheJWTToken';
    return jwt.sign({ id }, jwtSecret, { expiresIn: '30d' });
};

// Register new user
export const register = async (req, res) => {
    try {
        const { username, email, password, profilePic } = req.body;

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Users({
            username,
            email,
            password: passwordHash,
            profilePic
        });

        const user = await newUser.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Prepare user data to send
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            about: user.about,
            posts: user.posts,
            followers: user.followers,
            following: user.following
        };

        res.status(200).json({ token, user: userData });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        // Compare password using bcryptjs
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT token
        const token = generateToken(user._id);

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            about: user.about,
            posts: user.posts,
            followers: user.followers,
            following: user.following
        };

        res.status(200).json({ token, user: userData });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
