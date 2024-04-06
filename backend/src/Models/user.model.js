import mongoose from 'mongoose';

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
            default : "https://i.pinimg.com/originals/8e/6c/41/8e6c415ce319ca467b93c529bc1f3724.jpg",
        }
    },{timeStamp: true}
)

const User = mongoose.model('User', userSchema);
export default User;