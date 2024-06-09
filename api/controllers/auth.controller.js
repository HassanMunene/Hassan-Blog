import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const Signup = async(req, res, next) => {

	const {username, email, password} = req.body;

	if (!username || !email || !password || !username.trim() || !email.trim()) {
		const statusCode = 400;
		const message = "All fields are required";
		next(errorHandler(statusCode, message));
	}

    // check for an existing user with the same username or email
    const existingUser = await User.findOne({ $or: [{username}, {email}] });
    if (existingUser) {
        const statusCode = 400;
        const message = `User with this ${email} already exists. Please choose a different one`
        return next(errorHandler(statusCode, message))
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

export const Signin = async(req, res, next) => {
    const {email, password} = req.body
    if (!email || !password || !email.trim() || !password.trim()) {
        next(errorHandler(400, "All fields are required"))
    }

    try {
        //check If user exist
        const validUser = await User.findOne({email});
        if (!validUser) {
            return next(errorHandler(400, "Invalid user credentials"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid user credentials"));
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET_KEY)

        const {password: pass, ...restDetails} = validUser._doc;
        res.status(200).cookie("access_token", token, {httpOnly: true}).json({...restDetails, success: true, signin: "successful"})
    } catch(err) {
        console.log(err)
        next(err);
    }
}

export const GoogleOAuth = async(req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;

    try {
        const user = await User.findOne({email});
        if (user) {
            const token = jwt.sign({user_id: user._id}, process.env.JWT_SECRET_KEY);
            const {password: pass, ...rest} = user._doc;
            restDetails = {...rest, success: true}
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(resDetails)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const generatedUsername = name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);

            const newUser = new User({
                username: generatedUsername,
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save()
            const token = jwt.sign({user_id: newUser._id}, process.env.JWT_SECRET_KEY);
            const {password: pass, ...rest} = newUser._doc;
            restDetails = {...rest, success: true};
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(resDetails);
        }
    } catch(err) {
        next(err);
    }
}
