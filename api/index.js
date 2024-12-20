import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.js';
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

const PORT  = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(cookieParser());

app.use('/api' , userRouter);

const connect = async () =>{
     try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to the MongoDB");
     } catch (error) {
        throw error;
     }
}

app.get('/' , (req , res)=>{
    res.send("hello guys!")   
});

app.listen(PORT , ()=>{
      connect();
      console.log(`Server is running on port ${PORT}`);
});

