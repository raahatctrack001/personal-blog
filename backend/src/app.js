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
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }
));

app.use(express.static("public"));


// defining routes
import authRoute from "./Routes/auth.route.js";
app.use("/api/v1/auth", authRoute)





export default app;