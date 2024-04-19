// packages
import express from "express";
import { createServer, request } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const PORT = 5000;
const SecretKey = "SecretKey";

// configurations
const app = express();

// For handling of http request this sever is created
const server = createServer(app);

// To handle Io request create server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// middleware cors
app.use(cors());

const  authenticate=(socket, next)=>{
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));

    const decoded = jwt.verify(token, SecretKey);
    // console.log("decoded",decoded)
    return next();
  });
}
// Add authentication and middleware
io.use((socket, next) => {
  authenticate(socket, next);
});

// socket.io stuff
io.on("connection", (socket) => {
  console.log(`New client connected with Socket id ${socket.id}`);

  // BroadCast or send to allclient Message
  socket.on("broadCastMessage", (message) => {
    console.log("Message received From Client:", message);
    // sends the data to every connected client, including the client that originally sent the message
    io.emit("message", message);
    // sends the data to all connected clients except the client that triggered the event.
    // socket.broadcast.emit("message", message);
  });

  // send message to specific room
  socket.on("messageToRoom", ({ inputMessage, room }) => {
    console.log("Message received From Client:", inputMessage, room);
    socket.to(room).emit("message", inputMessage);
  });

  //Join Room
  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`User joined room ${roomName}`);
  });

  // Leaving a room
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Run the server

app.get("/login", (req, res) => {
  const token = jwt.sign({ __id: "Hitesh Ravani" }, SecretKey);

  res
    .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
    .json({ message: "Login Successfully" });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chat application" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
