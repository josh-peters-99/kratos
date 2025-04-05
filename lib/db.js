import mongoose from "mongoose";
// import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

// Mongoose connection (For Models)
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// MongoDB Native Client (For NextAuth Adapter)
// let client;
// let clientPromise;

// if (!MONGODB_URI) {
//     throw new Error("Please add MONGODB_URI to your .env.local");
// }

// if (process.env.NODE_ENV === "development") {
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(MONGODB_URI);
//         global._mongoClientPromise = client.connect();
//     }
//     clientPromise = global._mongoClientPromise;
// } else {
//     client = new MongoClient(MONGODB_URI);
//     clientPromise = client.connect();
// }

// export { clientPromise };