import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        // get the request body
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validate request body
        if (!email || !password) {
            console.log("Invalid request body:", reqBody);
            return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        // Check if password matches
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            console.log("Invalid password for user:", email);
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        // Generate JWT token
        const tokenData = {
            id: user._id,
            email: user.email,
            name: user.name,
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {expiresIn: "1d"});

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: {
                name: user.name,
                email: user.email,
            },
        });
        // response.cookies.set("token", token,{httpOnly: true, secure: true, sameSite: "strict", path: "/"});
        response.cookies.set("token", token,{httpOnly: true});

        return response;
        
        
    } catch (error) {
        console.error("Error in user login POST request:", error);
        return NextResponse.json({ error: "Something went wrong while logging in" }, { status: 500 });
    }
}