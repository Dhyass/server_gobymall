import mongoose from 'mongoose';

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("GOBYMALL Database connected");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};
