import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createPost, getPosts, deletePost, updatePost} from "../controllers/post.controller.js"

const route = express.Router()

route.post("/create-post", VerifyUser, createPost);
route.get("/get-posts", getPosts);
route.delete("/delete-post/:postId/:authorId", VerifyUser, deletePost);
route.put("/update-post/:postId/:authorId", VerifyUser, updatePost);

export default route
