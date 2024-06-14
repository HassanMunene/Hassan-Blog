import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createPost} from "../controllers/post.controller.js"

const route = express.Router()

route.post("/create-post", VerifyUser, createPost)

export default route
