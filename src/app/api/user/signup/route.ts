import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userName, email, password } = body;
        // validation left

        if (!userName || !email || !password) {
            console.log("Request body:", body);
            return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
        }

        // Check if user already exists
        const user = await User.findOne({ email }).select("-password -__v");
        if (user) {
            console.log("User already exists:", user);
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // check username already Taken
        const userNameExists = await User.findOne({ userName });
        if (userNameExists) {
            console.log("Username already Taken:", userNameExists);
            return NextResponse.json({ message: "Username already Taken" }, { status: 400 });
        }

        // Create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("User saved:", savedUser);

        // Send verification email
        await sendEmail({ email, emailType: "verify", userId: savedUser._id });
        console.log("Verification email sent to:", email);
        return NextResponse.json({ message: "User created successfully", success: true, savedUser });


    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}