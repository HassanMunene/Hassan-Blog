import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const Signup = async(req, res, next) => {

	const {username, email, password} = req.body;

	if (!username || !email || !password) {
		const statusCode = 400;
		const message = "All fields are required";

		next(errorHandler(statusCode, message));
	}

	try {
		const hashedPassword = bcryptjs.hashSync(password, 10);
		const newUser = User({
			username: username,
			email: email,
			password: hashedPassword,
		});
		await newUser.save()
		res.json({status: "success"});
	} catch(err) {
		console.log(err.message);
		next(err);
	}
}