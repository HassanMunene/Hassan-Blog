import express from "express";
import { Signup } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", Signup);

export default route;