import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
const connectDatabase = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`);
        console.log(`MongoDB connected, HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("FAILED! to connect database.");
        process.exit(1);
    }
}

export default connectDatabase;