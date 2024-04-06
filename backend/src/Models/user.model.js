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
        }
    },{timeStamp: true}
)
//do something before(pre) saving(save) the data
userSchema.pre('save', async function (next){
    if(!this.isModified('password'))
        return next();
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = function(password){
    return bcryptjs.compareSync(this.password, password);
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
            expiresIn: ACCESS_TOKEN_EXPIRY
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
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema);
export default User;