const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT

const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    // origin: 'http://localhost:3001'
}
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


app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is Running on port number ${PORT}`);
});
