import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected");
        });
        connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit();
        });

    } catch (error) {
        console.error(`Something went wrong while connecting to MongoDB`);
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}