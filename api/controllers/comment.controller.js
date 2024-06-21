import Comment from "../models/comment.model.js";
import {errorHandler} from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.user_id) {
            return next(errorHandler(403, 'You are not authorised to create this comment'));
        }
        const newComment = new Comment({
            content: content,
            postId: postId,
            userId: userId,
        });
        await newComment.save();
        res.status(200).json({newComment, success: true});
    } catch (error) {
        console.log(error)
        next(errorHandler(500, error.message));
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        const postComments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
        res.status(200).json({postComments: postComments, success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        const userIndex = comment.likes.indexOf(req.user.user_id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.user_id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1)
        }
        await comment.save();
        res.status(200).json({comment: comment, success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if (comment.userId !== req.user.user_id && req.user.isAdmin == false) {
            return next(errorHandler(403, 'You are not authorised to Edit this comment'));
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        }, {new: true})
        res.status(200).json({editedComment: editedComment, success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }
        if (req.params.commentId !== req.user.user_id && req.user.isAdmin == false) {
            return next(errorHandler(403, 'You are not authorised to delete this comment'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({message: 'Comment deleted successfully', success: true});
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

export const getComments = async(req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const comments = await Comment.find().sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });
        res.status(200).json({
            comments: comments,
            totalComments: totalComments,
            lastMonthComments: lastMonthComments,
            success: true
        })
    } catch(error) {
        console.log(error);
        next(errorHandler(500, error.message));
    }
}

