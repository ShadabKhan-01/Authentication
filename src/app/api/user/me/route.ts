import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/model/userModel";

export async function POST(request: NextRequest) {
    try {
        // Get the user ID from the token
        const id = await getDataFromToken(request);

        if (!id) {
            console.error(`No user ID found in token for request: ${request}`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }   

        // Find the user in the database
        const user = await User.findOne({ _id: id }).select("-password -__v");
        if (!user) {
            console.error(`User not found for request: ${request}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return the user details
        return NextResponse.json({message:"User Found",data: user, success:true}, { status: 200 });
        
    } catch (error) {
        console.error("Error in get user details request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}