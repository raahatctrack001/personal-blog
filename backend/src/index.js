import connectDatabase from "./Database/connection.database.js";
import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config({path:'./.env'});

connectDatabase()
    .then(()=>{
        app.listen(process.env.PORT, ()=>{
            console.log(`server is up and running on port ${process.env.PORT}`)
        })
    })
    .catch((error)=>{
        console.log("MongoDB connection FAILED", error);
    });

    
