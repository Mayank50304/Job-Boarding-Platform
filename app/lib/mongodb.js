import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://mayankilapakurthi:sPTQ6QHQujbRbSe9@cluster0.k3cqf.mongodb.net/jobboarding?retryWrites=true&w=majority&appName=Cluster0";


if (!MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
