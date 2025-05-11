import { NextResponse } from "next/server";

export async function GET() {

    try {
        // Clear the cookie
        const response = NextResponse.json({ message: "Logout successful", status: 200, succes: true });
        // response.cookies.set("token", "", {
        //     httpOnly: true,
        //     expires: new Date(0), // Set the expiration date to the past
        // });
        response.cookies.delete("token");
        return response;

    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}