import mongoose from "mongoose";
import AuthRoles from "../utils/AuthRoles.js";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true,"name is require"],
        trim : true,
        maxLength : [20,"name shouldn't exeed 20 charcters"]
    },
    
    email : {
        type : String,
        require : [true,"Email is reqire"]
    },
    
    password : {
        type : String,
        require : true,
        minLength : [8,"password should contain 8 characters"],
        select : false
    },
    
    phone : {
        type : String,
        require : true
    },
    
    address : {
        type : String,
        require : true,
        maxLength : [80,"address shoudin't exeed 80 characters"],
        trim : true
    },

    role : {
        type : String,
        enum : Object.values.AuthRoles,
        default : AuthRoles.USER
    }
},
{timestamps : true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods = {
    // compare password
    comparePassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }
}


export default mongoose.model("User",userSchema)