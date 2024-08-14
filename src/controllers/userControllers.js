const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User is already signed up. Try to log in instead." });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error while hashing the password." });
            }

            const newUser = new User({
                username,
                email,
                password: hash
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully." });
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please sign up." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: "Logged in successfully." });

    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};
module.exports = {signup, login};