import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createComment, getPostComments} from "../controllers/comment.controller.js";

const route = express.Router();

route.post("/create-comment", VerifyUser, createComment);
route.get("/get-post-comments/:postId", getPostComments);

export default route;
