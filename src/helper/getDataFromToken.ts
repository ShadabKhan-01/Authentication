import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest) => {

    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            console.error("No token found in cookies");
            return null;
        }

        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);

        return decodedToken.id;

    } catch (error) {
        console.error("Error parsing token:", error);
        throw new Error(`Failed to parse token: ${error}`);
    }
}