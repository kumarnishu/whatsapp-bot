import mongoose from 'mongoose';
import { Store } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';

// config database
let store:Store;
export const connectDatabase = () => {
    mongoose.set('strictQuery', true)
    mongoose
        .connect(process.env.DB_URL || `mongodb://127.0.0.1:27017/BOT`
        )
        .then((data) =>
           {
            console.log(`database server is running on ${data.connection.host} `)
            store=new MongoStore({mongoose:mongoose})
           }
        )
        .catch((err) => console.log(err.name, "server stopped running"));
}
export {store}