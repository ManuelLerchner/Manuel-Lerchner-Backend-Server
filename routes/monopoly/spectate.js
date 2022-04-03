const uuidv4 = require("uuid").v4;

const lobbies = new Map();

class Connection {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        this.socket.on("requestData", (groupID) => this.requestData(groupID));
        this.socket.on("Data", (data) => this.handleData(data));
        this.socket.on("changeRoom", (roomID) => this.socket.join(roomID));
        this.socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    // respond to request
    requestData(groupID) {
        console.log("Request of group", groupID);
        const nullMesage = {
            id: uuidv4(),
            playersJSON: JSON.stringify([]),
            groupID: groupID,
        };

        this.io.to(groupID).emit("Data", lobbies.get(groupID) || nullMesage);
    }

    //receive new Data
    handleData({ groupID, players: playersJSON }) {
        console.log("Update in group", groupID);
        const data = {
            id: uuidv4(),
            playersJSON: playersJSON,
            groupID: groupID,
        };

        lobbies.set(groupID, data);

        this.io.to(groupID).emit("Data", data);
    }
}

function spectate(io) {
    io.on("connection", (socket) => {
        socket.on("checkIfOnline", function () {
            io.emit("isOnlineResponse", true);
        });
        console.log("User conencted to Backend-Server");
        new Connection(io, socket);
    });
}

setInterval(function () {
    var date = new Date();
    if (date.getHours() === 5 && date.getMinutes() === 0) {
        lobbies.clear();
    }
}, 60000);

module.exports = spectate;
