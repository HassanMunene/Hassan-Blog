import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createComment, getPostComments, likeComment, editComment} from "../controllers/comment.controller.js";

const route = express.Router();

route.post("/create-comment", VerifyUser, createComment);
route.get("/get-post-comments/:postId", getPostComments);
route.put("/like-comment/:commentId", VerifyUser, likeComment);
route.put("/edit-comment/:commentId", VerifyUser, editComment);

export default route;
