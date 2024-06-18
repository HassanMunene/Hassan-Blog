import express from "express";
import {VerifyUser} from "../utils/verifyToken.js";
import {createComment} from "../controllers/comment.controller.js";

const route = express.Router();

route.post("/create-comment", VerifyUser, createComment);

export default route;
