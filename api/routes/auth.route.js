import express from "express";
import { Signup, Signin } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", Signup);
route.post("/signin", Signin);

export default route;
