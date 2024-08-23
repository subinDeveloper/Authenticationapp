import config from "../config/config.js"
import User from "../model/userSchema.js"
import JWT from "jsonwebtoken"

export const cookieOptions={
    expires : new Date(Date.now()+3*24*60*60*1000)
}

export const signup = async(req,res) => {
    try{
//Get info from the frontend 
const{name,email,password,phone,address} = req.body
//Validation
if(!name || !email || !password || !phone || !address){
    res.status(400).json({
        success : false,
        message : "All feilds are require"
    })
}
//Check the is exist in DB
const existingUser = await User.findOne({email})
//If the user exis DB send response
if(existingUser){
    res.status(200).json({
        success : false,
        message : "You have already account please login"
    })
}
//If the user dosen't exist,create new user
const user = await User.create({
    name,email,password,phone,address
})
user.password = undefined
//send success message 
res.status(200).json({
    success : true,
    message : "Successfully signdup",
    user
})
    }catch(error){
        console.log(`Error in signup${error}`);
 res.status(500).json({
    success : false,
    message : "Error in signup",error
 })
        
    }
}
    
export const login = async(req,res) => {
    try{
//Get info from the fronent
const{email,password} =req.body
//Validation
if(!email || !password){
    res.status(400).json({
        success : false,
        message  : "invalid email or passwor"
    })
}
//Check the user exist in DB 
const user =await User.findOne({email}).select("+password")
//If the user doesn't exist send response
if(!user){
    res.status(404).json({
        success : false,
        message : "Please signup"
    })
}
//If the user exist compare password 
const isPasswordMatched = await user.comparePassword(password)
//If the password doesn't match,send response

if(!isPasswordMatched){
    res.status(400).json({
        success : false,
        message : "Invalid password"
    })
}
    
//If the password match genarate token
const token = JWT.sign({_id : user._id,role : user.role},
    config.JWT_SECRET,
    {expiresIn : config.JWT_EXPIRY}
)

//Setup cookie
res.cookie("token",token,cookieOptions)
//Send success message 
res.status(200).json({
    success : true,
    message : "successfully login",
    user : {
id : user._id,
name : user.name,
email : user.email,
phone : user.phone,
address : user.address,
role : user.role
    },
    token
})
    }catch(error){
        /*console.log(`Error in login${error}`);*/
        res.status(500).json({
            success : false,
            message : "Error in login",
            error
        })
        
    }
}

export const logout = async(req,res) => {
    try{
res.cookie("token",null,{
    expires : new Date(Date.now()),
    httpOnly : true
})
//send suucess message 
res.status(200).json({
    success : true,
    message : "successfully loged out"
})
    }catch(error){
      /*  console.log(`Error in logout${error}`);*/
        res.status(500).json({
            success : false,
            message : "Error in logout",
            error
        })
        
    }
}

