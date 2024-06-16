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
    try {
        const savedPost = await newPost.save();
        const postDetails = savedPost._doc;
        res.status(201).json({...postDetails, success: true})
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message))
    }
}

export const getPosts = async(req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.authorId && {authorId: req.query.authorId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ],
            }),
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });
        res.status(200).json({
            posts: posts,
            totalPosts: totalPosts,
            lastMonthPosts: lastMonthPosts,
            success: true
        })
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const deletePost = async(req, res, next) => {
    console.log(req.user)
    if (!req.user.isAdmin || req.user.user_id !== req.params.authorId) {
        return next(errorHandler(403, "You are not authorised to delete this post"));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({message: 'Post has been deleted successfully', success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message))
    }
}
