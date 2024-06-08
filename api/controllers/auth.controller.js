import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const Signup = async(req, res) => {

	const {username, email, password} = req.body;

	if (!username || !email || !password) {
		return res.status(400).json('All fields are required');
	}

	try {
		const hashedPassword = bcryptjs.hashSync(password, 10);
		const newUser = User({
			username: username,
			email: email,
			password: hashedPassword,
		});
		await newUser.save()
	} catch(error) {
		console.log(error.message);
		res.status(500).json({status: error.message});
	}
	res.json({status: "success"});
}