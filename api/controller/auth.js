import bcrypt from "bcrypt";
import { config as configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';
import user from '../models/user.js';

configDotenv();

export const signUp = async (req , res) =>{
       try {
             
         const {name , email , password , role} = req.body;
     
         const existingUser = await user.findOne({email});

         if(existingUser){
             return res.status(400).json({
                 success: false,
                 message : "User already exist",
             });
         }
         
          let hashedPassword;
          try {
             hashedPassword = await bcrypt.hash(password , 10);
          } catch (error) {
              res.status(500).json({
                 success : false,
                 message : "Error hashing password"
              });
          }

          const newUser = await user.create({
             name,
             email,
             password : hashedPassword,
             role,
          });
          
          res.status(200).json({
             success : true,
             message : "User created Successfully!"
          });

       } catch (error) {
          console.error(error);
          res.status(500).json({
             success : false,
             error : error,
             message : "Error creating user",
          });
       }
};

export const login = async (req , res) =>{
      try {
          const {email , password} = req.body;
          
           if(!email || !password){
               return res.status(401).json({
                  success : false,
                  message : "user not found"
               });
           }

           const existingUser = await user.findOne({email});

           if(!existingUser){
              return res.status(404).json({
                 success : false,
                 message : "user not found",
              });
           }

           const isPasswordValid = await bcrypt.compare(password , existingUser.password);
           if(!isPasswordValid){
              return res.status(401).json({
                 success : false,
                 message : "Invalid password",
              });
           }

           let payload = {
               email : existingUser.email,
               id : existingUser._id,
               role : existingUser.role,
           };

           // verify the password and generate the jwt token

           if(await bcrypt.compare(password , existingUser.password)){
                let token = jwt.sign(payload , process.env.MONGO_URL , {
                     expiresIn : "2h"
                });

                const userObject = existingUser.toObject();
                userObject.token = token;
                userObject.password = undefined;

                let options = {
                     expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                     httpOnly : true,
                };
                res.cookie("token" , token , options).status(200).json({
                    success : true,
                    token,
                    userObject,
                    message : "user logged in successfully",  
                });
           }
           else{
              return res.status(403).json({
                  success : false,
                  message : "Invalid Password",
              });
           }

      } catch (error) {
          res.status(500).json({
              success : false,
              message : "Error logged in",
              error : error,
          });
      }
};



