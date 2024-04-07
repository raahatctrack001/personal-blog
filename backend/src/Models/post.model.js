import mongoose from 'mongoose';

const postSchema = mongoose.Schema( 
    {
        title: {
            type: String, 
            require: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        slug: {
            type: String,
            require: true,
            unique: true,
        },
        category: {
            type: String,
            default: 'Uncategorised'
        },
        postImage: {
            type: String,
            default: "https://www.lovelearnings.com/wp-content/uploads/2020/05/no-posts-yet-705x352.png"
        }
    },
    {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);
export default Post;