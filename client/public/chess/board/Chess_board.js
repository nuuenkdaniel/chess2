class Chess_board {
  constructor(board_length, board_width) {
    this.board_length = board_length;
    this.board_width = board_width;
    this.board = [];
    this.create_board;
    this.white_king = null;
    this.black_king = null;
  }

  get_tile(r, c) { return this.board[r][c] }
  set_tile(piece, r, c) { return this.board[r][c] = piece }

  /**
   * Creates an empty board
   */
  create_board() {
    for(let r = 0; r < this.board_length; r++) {
      this.board[r] = [];
      for(let c = 0; c < this.board_width; c++) {
        this.board[r][c] = null;
      }
    }
  }

  /**
   * Creates a default chess board
   */ 
  default_board_setup() {
    // Place the pawns
    for(let c = 0; c < this.board_length; c++) {
      this.set_tile(new Pawn("black"), 1, c);
      this.set_tile(new Pawn("white"), 6, c);
    }

    // Place the back rows
    this.set_tile(new Rook("black"), 0, 0);
    this.set_tile(new Rook("white"), 7, 0);
    this.set_tile(new Rook("black"), 0, 7);
    this.set_tile(new Rook("white"), 7, 7);
    this.set_tile(new Knight("black"), 0, 1);
    this.set_tile(new Knight("white"), 7, 1);
    this.set_tile(new Knight("black"), 0, 6);
    this.set_tile(new Knight("white"), 7, 6);
    this.set_tile(new Bishop("black"), 7, 2);
    this.set_tile(new Bishop("white"), 0, 2);
    this.set_tile(new Bishop("black"), 7, 5);
    this.set_tile(new Bishop("white"), 0, 5);
    this.set_tile(new Queen("black"), 0, 3);
    this.set_tile(new Queen("white"), 7, 3);

    // Place the kings
    this.black_king = this.set_tile(new King("black", this.board_length, this.board_width), 0, 4);
    this.white_king = this.set_tile(new King("white", this.board_length, this.board_width), 7, 4);
  }
}
