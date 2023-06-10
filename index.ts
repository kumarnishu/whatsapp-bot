import express, { NextFunction, Request, Response } from "express"
const app = express();

import compression from "compression"
import { createServer } from "http"
import { configDotenv } from "dotenv";
import session from "express-session";
import { connectDatabase } from "./config/db";
import cors from "cors"
import path from "path"
import morgan from "morgan"
var MongoDBStore = require('connect-mongodb-session')(session);
import UserRoutes from "./routes/user.routes"
import BotRoutes from "./routes/bot.routes"
import { Server } from "socket.io";
import { Socket } from "socket.io";
export const server = createServer(app)

let AppSocket: Socket;
configDotenv()

const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || "http://localhost"
const ENV = process.env.NODE_ENV

connectDatabase()

let origin = ""
if (ENV === "devlopment")
    origin = "http://localhost:3000"

if (ENV === "devlopment")
    app.use(cors({
        origin: [origin],
        credentials: true
    }))

let io: Server | undefined = undefined
io = new Server(server, {
    cors: {
        origin: origin
    }
});

io.on("connection", (socket) => {
    console.log("socket connected")
    AppSocket = socket
    // upon disconnection
    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
});


const store = new MongoDBStore({
    uri: process.env.DB_URL || `mongodb://127.0.0.1:27017/BOT`,
    collection: 'sessions'
})

store.on('error', function (error: any) {
    console.log(error);
});


app.use(express.json())
app.use(compression())
app.use(morgan('tiny'))
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: false
}))

app.use("/api/v1", UserRoutes)
app.use("/api/v1", BotRoutes)

//serve client
if (ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "build/", "index.html"));
    })
}
else {
    app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
        res.status(404).json({ message: "resource not found" })
    })
}


//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({
        message: err.message || "unknown  error occured"
    })

})

server.listen(PORT, () => {
    console.log(`running on ${HOST}:${PORT}`)
});

export { AppSocket }