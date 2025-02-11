import mongoose from "mongoose";
import { config } from 'dotenv';
config();

const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) {
    throw new Error("No mongoDB uri found in .env file");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDb() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };

        cached.promise = mongoose
            .connect(MONGO_URL, opts)
            .then(() => mongoose.connection)

    }

    try {
        cached.conn = await cached.promise;

    } catch (err) {
        cached.promise = null
        throw err
    }

    return cached.conn;


}