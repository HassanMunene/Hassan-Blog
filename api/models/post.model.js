import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        authorId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            default: "uncategorized",
        }
    },
	{timestamps: true}
);

const Post = mongoose.model('Post', PostSchema);

export default Post;
