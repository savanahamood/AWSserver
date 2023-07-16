
// const ioServer = require("socket.io")(3000);

const socket = io();

// Join the room
socket.emit("joinRoom");

// Handle new user joined
socket.on("userJoined", (userId) => {
  const userElement = document.createElement("div");
  userElement.textContent = `User ${userId} joined the room`;
  document.getElementById("users").appendChild(userElement);
});

// Handle user left
socket.on("userLeft", (userId) => {
  const userElement = document.createElement("div");
  userElement.textContent = `User ${userId} left the room`;
  document.getElementById("users").appendChild(userElement);
});

// Handle new bid
socket.on("newBid", ({ user, bid }) => {
  const bidElement = document.createElement("div");
  bidElement.textContent = `User ${user} placed a bid of ${bid}`;
  document.getElementById("bids").appendChild(bidElement);
});

// Handle bid button click
document.getElementById("bidButton").addEventListener("click", () => {
  const bidAmount = parseInt(document.getElementById("bidInput").value);
  socket.emit("bid", bidAmount);
});