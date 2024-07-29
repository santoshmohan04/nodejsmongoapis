const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      mongoose.set('strictQuery', false);
      const url = 'mongodb+srv://tagore412:06c01a1036@cluster0.2ifj302.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        const connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);   

    }
};

module.exports = connectDB;