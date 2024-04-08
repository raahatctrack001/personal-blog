import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config({path: './.env'});

const app = express();

//cors origin
//cookieParser
//json
//urlencoded
//static
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        Credential: true,
    }
));

app.use(cookieParser());
app.use(express.json({limit: "16kb"})); // to send json data
app.use(express.urlencoded(   //to send urlencoded data like slud.includes(+, -) 
    {
        extended: true,
        limit: "16kb"
    }
));

app.use(express.static("public")); 


// defining routes
import authRoute from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";
import postRouter from "./Routes/post.route.js";
import commentRouter from "./Routes/comment.route.js";
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter); 
app.use("/api/v1/comment", commentRouter);



export default app;