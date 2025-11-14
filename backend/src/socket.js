const { Server } = require("socket.io");

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Namespaces for separation
  const chefNs = io.of("/chef");
  const waiterNs = io.of("/waiter");
  const managerNs = io.of("/manager");
  const tableNs = io.of(/^\/table:\d+$/); // namespace per table like /table:12

  chefNs.on("connection", (socket) => {
    console.log("Chef connected", socket.id);
  });

  waiterNs.on("connection", (socket) => {
    console.log("Waiter connected", socket.id);
  });

  managerNs.on("connection", (socket) => {
    console.log("Manager connected", socket.id);
  });

  // dynamic table namespaces
  tableNs.on("connection", (socket) => {
    console.log("Table namespace connected", socket.nsp.name, socket.id);
  });

  return io;
}

function getIo() {
  return io;
}

module.exports = { initSocket };
module.exports = { initSocket, getIo };
