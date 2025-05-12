import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const { email, token } = reqBody;
        console.log("Request body:", reqBody);

        // Validate request body
        if (!email || !token) {
            console.log("Invalid request body:", reqBody);
            return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
        }

        // Find user by userId and token
        const user = await User.findOne({ email:email, verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            console.log(`user verification failed for email: ${email} with token: ${token}`);
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }
        console.log("User found:", user);

        // Update user verification status
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        console.log("User verified successfully:", user);
        return NextResponse.json({ message: "User verified successfully", success: true }, { status: 200 });
        
    } catch (error) {
        console.error("Error in user verifycation POST request:", error);
        return NextResponse.json({ error: "Something went wrong while verifying user" }, { status: 500 });
    }
}