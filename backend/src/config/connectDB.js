import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database is connected");
    } catch (error) {
        process.exit(1);
    }
}