import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URL,{dbName: "TaskManager", useNewUrlParser: true, useUnifiedTopology: true});
    console.log("MongoDB Connected Successfully !");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
