import express from "express";
import { signUp , login } from "../controller/auth.js";
import {auth , isStudent , isAdmin} from "../middlewares/auth.js";


const router = express.Router();

router.post('/signup' , signUp);
router.post('/login' , login);

router.get('/test', auth, (req , res)=>{
    res.json({
       success : true,
       message : "test route",
    });
});

router.get('/student' , auth , isStudent , (req , res)=>{
     res.json({
         success : true,
         message : "Student route", 
     });   
});

router.get('/admin' , auth , isAdmin , (req , res)=>{
    res.json({
        success : true,
        message : "Admin route",
    });
});

export default router;