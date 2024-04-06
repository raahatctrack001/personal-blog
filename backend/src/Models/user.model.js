import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
            default: "https://i.pinimg.com/originals/8e/6c/41/8e6c415ce319ca467b93c529bc1f3724.jpg",
        },
        refreshToken:{
            type: String
        }
    },{timeStamp: true}
)
// pre hook: before 'save' this document do this following
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) 
        return next();

    this.password = bcryptjs.hashSync(this.password, 10)
    next()
})
//method injection: to check whether entered password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
    // console.log('inside userSchema', password)
    // return bcryptjs.compareSync(this.password, password); //   WRONG!!!! first normal passsword then hashed password
    return bcryptjs.compareSync(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema);
export default User;