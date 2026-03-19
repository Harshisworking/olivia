import mongoose from 'mongoose';

const db_url = process.env.MONGODB_URI || "";

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;

    return mongoose.connect(db_url);
};

export default dbConnect;