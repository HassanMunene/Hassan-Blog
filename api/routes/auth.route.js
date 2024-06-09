import express from "express";
import { Signup, Signin, GoogleOAuth } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", Signup);
route.post("/signin", Signin);
route.post("/google", GoogleOAuth);

export default route;
