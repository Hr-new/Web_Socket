// packages
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

// configurations
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// middleware(s)
app.use(cors());

// socket.io stuff
io.on("connection", (socket) => {
  console.log(`New client connected with Socket id ${socket.id}`);

  // socket.on("message", (message) => {
  //   console.log("Message received From Client:", message);
  //   io.emit("message", message);
  // });

  // send message to group
  socket.on("message", ({inputMessage,room}) => {
      console.log("Message received From Client:", inputMessage,room);
    socket.to(room).emit("receive-message", inputMessage);
  });

  socket.on("join-room",(roomName)=>{
    socket.join(roomName)
    console.log(`User joined room ${roomName}`);

  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Run the server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
