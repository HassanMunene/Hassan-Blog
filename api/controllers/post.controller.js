import {errorHandler} from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async(req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "Only Admin is authorised to create a post"));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "You must provide all the required fields"));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({
        ...req.body,
        slug: slug,
        authorId: req.user.user_id,
    });
    console.log(newPost);
    try {
        const savedPost = await newPost.save();
        const postDetails = savedPost._doc;
        res.status(201).json({...postDetails, success: true})
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message))
    }
}
