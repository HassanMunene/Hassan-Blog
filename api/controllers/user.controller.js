import {errorHandler} from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
	res.json({status: "yooo this is api testing"});
}

export const UpdateUser = async (req, res, next) => {
    if (req.user.user_id != req.params.userId) {
        console.log("The ids are not the same the one in cookie and the one in parameter");
        console.log(req.user.user_id, req.params.userId)
        return next(errorHandler(403, "You are not authorized to update this user"));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username must not contain spaces'));
        }
        if (req.body.username != req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be in lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can should contain letters and numbers'));
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            {new: true}
        );
        const {password: pass, ...rest} = updatedUser._doc;
        const restDetails = {...rest, success: true}
        res.status(200).json(restDetails);
    } catch(err) {
        console.log(err);
        next(err.message);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.user_id !== req.params.userId) {
        console.log("The id in the param and cookie are not the same");
        return next(errorHandler(400, "You are not authorised to delete this account"));
    }
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return next(errorHandler(404, "User not found"))
        }
        res.status(200).json({message:"User deleted successfully", success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const signOutUser = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({message: "User sign out successful", success: true});
    } catch(error) {
        next(errorHandler(500, "Sign out not successful"))
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not authorised to see all the users"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.sort === 'asc' ? 1: -1;

        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);
        const userWithoutPassword = users.map((user) => {
            const {password: pass, ...restDetails} = user._doc;
            return restDetails;
        });

        const totalUsers = await User.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({createdAt: {$gte: oneMonthAgo}});

        res.status(200).json({
            users: userWithoutPassword,
            totalUsers: totalUsers,
            lastMonthUsers: lastMonthUsers,
            success: true,
        });
    } catch(error) {
        next(errorHandler(500, error.message));
    }
}

export const  deleteUserByAdmin = async(req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not authorised to delete this post"));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: 'User has been deleted successfully', success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json({user: user, success: true})
    } catch (error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

