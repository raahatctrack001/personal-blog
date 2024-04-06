import { kMaxLength } from 'buffer';
import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "please enter username"],
            maxLength: [25, "username can't exceed 25 character"],
            unique: true,
        },
        email: {
            type: String,
            require: [true, "please enter valid email"]
        },
        password: {
            type: String,
            require: [true, "please enter your password"],
            minLength: [8, "password must be at least 8 character"]
        },
        photoURL: {
            type: String,

        }
    },{timeStamp: true}
)

const User = mongoose.model('User', userSchema);
export default User;