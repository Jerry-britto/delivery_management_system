import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}${process.env.DB_NAME}`
    );
    console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`MONGO DB CONNECTION ERROR `, error);
    process.exit(1); //to exit the application (node js)
  }
};

export default connectToDb;
