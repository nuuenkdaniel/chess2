import { ChessBoard } from "./Chess/src/board/ChessBoard.js";
import { Tile } from "./Chess/src/board/Tile.js";
import { Server } from "socket.io";

const boards = new Map();

// Server setup
const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  }
})

io.on("connection", (socket) => {
  console.log("Client connected with id of:" + socket.id);

  socket.on("new-game", (room_name, color, time) => {
    const new_board = new ChessBoard;
    boards.set(room_name, new_board);
    new_board.defaultBoardSetUp();
  })

  socket.on("join-game", (room_name, color) => {
  })

  socket.on("move-piece", (x_init, y_init, x_dest, y_dest) => {

  })
})
