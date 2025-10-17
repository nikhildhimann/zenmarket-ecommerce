import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGOURL);
        console.log(`Mongosse connect Succesfully : ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`error : ${error.message}`);
        process.exit(1);
    }
};


mongoose.connection.on("error", (err)=>{
    console.error(`Mongoose  connection error : ${err.message}`);
});

export default connectDB;