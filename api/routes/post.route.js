import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createPost, getPosts} from "../controllers/post.controller.js"

const route = express.Router()

route.post("/create-post", VerifyUser, createPost);
route.get("/get-posts", getPosts);

export default route
