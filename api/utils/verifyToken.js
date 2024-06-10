import jwt from "jsonwebtoken";
import {errorHandler} from "./error.js";

export const VerifyUser = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(403, "No token provied, Authorization denied"));
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                return next(errorHandler(401, "Invalid token"));
            }
            req.user = decoded;
            next();
        });
    } catch(err) {
        console.log(err);
        next(err.message);
    }
};
