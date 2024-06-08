import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const Signup = async(req, res, next) => {

	const {username, email, password} = req.body;

	if (!username || !email || !password || !username.trim() || !email.trim()) {
		const statusCode = 400;
		const message = "All fields are required";
		next(errorHandler(statusCode, message));
	}

    // Validate email format:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const statusCode = 400;
        const message = "Invalid email format. Please enter a valid email address.";
        next(errorHandler(statusCode, message));
    }

    // check for an existing user with the same username or email
    const existingUser = await User.findOne({ $or: [{username}, {email}] });
    if (existingUser) {
        const statusCode = 400;
        const message = `User with this ${email} already exists. Please choose a different one`
        next(errorHandler(statusCode, message))
    }

	try {
		const hashedPassword = bcryptjs.hashSync(password, 10);
		const newUser = User({
			username: username,
			email: email,
			password: hashedPassword,
		});
		await newUser.save()
		res.json({status: "signup successfull", success: true});
	} catch(err) {
		console.log(err.message);
		next(err);
	}
}
