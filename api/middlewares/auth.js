import express from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
const router = express.Router();

configDotenv();

 export const auth = async (req , res , next)=>{
        try {
            // extract jwt token
            console.log("cookies" , req.cookies);
            console.log("header" , req.header("Authorization"));
            const token = req.header("Authorization").replace("Bearer" , "");
            console.log("token" , token);

            if(!token || token === undefined){
                return res.status(401).json({
                   success : false,
                   message : "token missing",
                });
            }
            // verify token

            try {
                const decoded = jwt.verify(token , process.env.MONGO_URL);
                console.log("decoded" , decoded);
                res.user = decoded
            } catch (error) {
                   res.status(401).json({
                         success : false,
                         message : "Invalid token",
                  });
            }
            next();
        } catch (error) {
            res.status(500).json({
                   success : false,
                   message : error.message,
            });
        }
};

export const isStudent = async (req , res , next) =>{
        try {
            if(res.user.role !== "Student"){
                return res.status(401).json({
                   success : false,
                   message : "Unauthorized",
                });
            }
            next();
        } catch (error) {
            res.status(500).json({
                   success : false,
                   message : error.message,
            });
        }
};


export const isAdmin = async (req , res , next)=>{
     try {
        if(res.user.role !== "Admin"){
              return res.status(401).json({
                     success : false,
                     message : "Unauthorized",
              });
        }     
        next();
     } catch (error) {
        res.status(500).json({
             success : false,
             message : error.message,
        });
     }
};


