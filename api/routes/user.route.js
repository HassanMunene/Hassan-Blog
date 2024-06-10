import express from "express";
import { test } from "../controllers/user.controller.js";
import {UpdateUser} from "../controllers/user.controller.js";
import {VerifyUser} from "../utils/verifyToken.js";

const route = express.Router();

route.get("/test", test);
route.put("/update/:userId", VerifyUser, UpdateUser);

export default route;
