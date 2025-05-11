import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        },
    email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: true,
        },
    password: {
        type: String,
        required: [true, "Please provide a Password"],
        },
    isVerified: {
        type : Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    forgotPasswrodToken: {
        type : String,
    },
    forgotPasswordTokenExpiry: {
        type : Date,
    },
    verifyToken: {
        type : String,
    },
    verifyTokenExpiry: {
        type : Date,
    }, 
})

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;