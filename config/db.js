import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://admin:helloNigga78@cluster0.s4qoiro.mongodb.net/pharma?retryWrites=true&w=majority"
    );
    console.log(
      `Conneted To Mongodb Database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Erorr in Mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;
