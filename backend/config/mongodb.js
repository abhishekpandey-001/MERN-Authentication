import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Connection string for mongodb is missing");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);

    process.exit(1);
  }
};

export default connectDB;
