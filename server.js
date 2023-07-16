
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Store the current bidding price
let currentBid = 0;

// Store the connected users in the room
let users = [];

io.on("connection", (socket) => {
  // Join the room
  socket.on("joinRoom", () => {
    socket.join("bidRoom");
    users.push(socket.id);
    console.log(`User ${socket.id} joined the room`);

    // Notify other users about the new user
    socket.broadcast.to("bidRoom").emit("userJoined", socket.id);
  });

  // Handle bidding
  socket.on("bid", (bidAmount) => {
    if (bidAmount > currentBid) {
      currentBid = bidAmount;
      // Broadcast the new bid to all users in the room
      io.to("bidRoom").emit("newBid", { user: socket.id, bid: currentBid });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove the user from the room
    const index = users.indexOf(socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      console.log(`User ${socket.id} left the room`);

      // Notify other users about the disconnected user
      socket.broadcast.to("bidRoom").emit("userLeft", socket.id);
    }
  });
});

// Serve the static files
app.use(express.static(path.join(__dirname, "public")));

// Handle the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});