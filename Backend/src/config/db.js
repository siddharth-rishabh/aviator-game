import mongoose from "mongoose";

async function connectDB() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    } catch (error) {

        console.log(error);
        console.log("not connected");

    }

}

export default connectDB;