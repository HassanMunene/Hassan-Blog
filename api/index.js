import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import PostRoute from "./routes/post.route.js";
import cookieParser from 'cookie-parser';
import CommentRoute from "./routes/comment.route.js";
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
        console.log("Connected to mongodb")
})
.catch((error) => {
    console.log(error);
});
const __dirname = path.resolve()

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);
app.use("/api/comment", CommentRoute);

app.use(express.static(path.join(__dirname, '/clientSide/dist')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'clientSide', 'dist', 'index.html'));
})

app.use((err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Serve Error';

    res.status(statusCode).json({
        success: false,
        status: "fail",
        statusCode: statusCode,
        message: message
    });
})
app.listen(3000, () => {
    console.log("Server listening on port 3000!");
})
