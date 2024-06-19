import express from "express";
import { test } from "../controllers/user.controller.js";
import {UpdateUser, deleteUser, signOutUser, getUsers, deleteUserByAdmin, getUser} from "../controllers/user.controller.js";
import {VerifyUser} from "../utils/verifyToken.js";

const route = express.Router();

route.get("/test", test);
route.put("/update/:userId", VerifyUser, UpdateUser);
route.delete("/delete/:userId", VerifyUser, deleteUser);
route.post("/signout", signOutUser);
route.get("/get-users", VerifyUser, getUsers);
route.delete("/delete-user/:userId", VerifyUser, deleteUserByAdmin)
route.get("/:userId", getUser);

export default route;
