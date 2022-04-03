const { Server } = require("socket.io");

const spectate = require("./spectate");

function setupSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        path: "/monopoly/socket.io",
    });

    spectate(io);
}

module.exports = setupSocketIO;
