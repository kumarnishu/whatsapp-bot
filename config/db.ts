import mongoose from 'mongoose';

// config database
export const connectDatabase = () => {
    mongoose.set('strictQuery', true)
    mongoose
        .connect(process.env.DB_URL || `mongodb://127.0.0.1:27017/BOT`
        )
        .then((data) =>
            console.log(`database server is running on ${data.connection.host} `)
        )
        .catch((err) => console.log(err.name, "server stopped running"));
}