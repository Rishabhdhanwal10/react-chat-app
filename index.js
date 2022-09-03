const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT

const io = new Server(server, {
  cors: {
    // origin: "http://192.168.0.104:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  })
}else{
  app.get('/', (req, res) => {
      res.send('Api Running');
  })
}


server.listen(PORT, () => {
  console.log(`Server is Running on port number ${PORT}`);
});
