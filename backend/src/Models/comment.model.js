import { timeStamp } from 'console'
import mongoose from 'mongoose'
import { type } from 'os'

const commentSchema = mongoose.Schema(
    {
        comment: {
            type: String,
            require: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ]

    }, {timeStamp: true}
);

const Comment = new mongoose.model("Comment", commentSchema);
export default Comment;