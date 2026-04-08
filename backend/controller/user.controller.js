import User from "../model/user.model.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import { generateTokenAndSaveInCookies } from '../jwt/token.js'

const userSchema = z.object({
    email: z.email({message:"Invalid email address"}),
    username: z.string().min(3,{message:"Username atleast 3 characters long"}),
    password: z.string().min(6,{message:"Password atleast 6 characters long"}),
})

export const register = async(req, res) => {
    try {
        const{username, email, password} = req.body;

        if(!email || !username || !password){
            return res.status(400).json({message:"All feilds are required"});
        }
        const validation = userSchema.safeParse({email, username, password})
        if(!validation.success){
            const errorMessage = validation.error.errors.map((err)=>err.message);
            return res.status(400).json({errors:errorMessage})
        }


        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already registered"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({email, username, password:hashPassword});
        await newUser.save();
        if(newUser){

            const token = await generateTokenAndSaveInCookies(newUser._id, res);

            res.status(200).json({message:"User Registered Successfully", newUser, token});
        }
    } catch (error) {
        console.error(error)
        res.status(404).json({message:"Error registering user"})
    }
}



export const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"All feilds are required"})
        }
        const user = await User.findOne({email}).select("+password")
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message:"Invalide email or password"})
        }

        const token = await generateTokenAndSaveInCookies(user._id, res); 

        res.status(200).json({message:"User logged in Successfully",user, token});
    } catch (error) {
        console.error(error)
        res.status(404).json({message:"Error logging user"})
    }
}


 
export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            path:"/",
        });
        res.status(200).json({message:"User logged out Successfully"});
    } catch (error) {
        console.error(error);
        res.status(400).json({message:"Error logging out user"})
    }
}