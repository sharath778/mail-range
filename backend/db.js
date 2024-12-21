import mongoose from 'mongoose';

// Connect to MongoDB

const connectDB = async () => {
  try {

    
    // const conn = await mongoose.connect("mongodb+srv://satyaS:Satya123456@cluster0.rwedk5w.mongodb.net/");
    const conn = await mongoose.connect("mongodb+srv://project77:Laxmi@cluster0.iu51g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
