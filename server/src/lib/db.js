import mongoose from "mongoose";


const connectDB = async ()=>{

    try {
       const connStatus = await mongoose.connect(process.env.MONGODB_URL);
       console.log(`MongoDB connected with : ${connStatus.connection.host}`)
    } catch(e){
         console.log(`Unable to stablish MongoDB connection : ${e}`)
    }
}

export {connectDB} ;