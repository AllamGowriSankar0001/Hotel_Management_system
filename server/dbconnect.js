const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODBURL || "mongodb+srv://allamgowrisankar01_db_user:allamgowrisankar01@hotel-management.ro6cjpk.mongodb.net/");
        console.log(`MongoDB connected: ${connect.connection.host}`);
        
        // Drop the unique index on email if it exists
        const User = require('./models/userModel');
        try {
            await User.collection.dropIndex('email_1');
            // console.log('Dropped unique index on email field');
        } catch (err) {
            // Index might not exist, which is fine
        }
    }
    catch(err){
        console.error(`Error: ${err.message}`);
    }
}
module.exports = connectDB;