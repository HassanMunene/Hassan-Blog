import Comment from "../models/comment.model.js";

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
