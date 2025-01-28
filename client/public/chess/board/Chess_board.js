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
  get_black_king() { return this.black_king }
  get_white_king() { return this.white_king }

  /**
   * Returns the possible moves of the piece on the selected tile
   * @param { int } r - row of the tile
   * @param { int } c - column of the tile
   * @returns { int[] } - An array of possible moves of the selected piece
   */
  get_possible_moves(r, c) { return this.get_tile(r,c).get_possible_moves(r,c,this) }
    
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

  /** 
   * Copies item from specified src tile to specified dest tile
   * and set the source tile to null and updating the king
   * @param { int } r_src - row of the source tile
   * @param { int } c_src - column of the source tile
   * @param { int } r_dest - row of the destination tile
   * @param { int } c_dest - column of the destination tile
   */
  move(r_src, c_src, r_dest, c_dest) {
    this.set_tile(this.get_tile(r_src, c_src), r_dest, r_dest);
    this.set_tile(null, r_src, c_src);
  }

  /**
   * Moves piece from specified src tile to specified dest tile
   * while making sure it does not cause a check
   * @param { int } r_src - row of the source tile
   * @param { int } c_src - column of the source tile
   * @param { int } r_dest - row of the destination tile
   * @param { int } c_dest - column of the destination tile
   * @returns { Bool } - true if piece was moved; false otherwise
   */
  move_piece(r_src, c_src, r_dest, c_dest) {
    let curr_piece = this.get_tile(r_src,c_src);

    // Return if no piece exists on src tile
    if(curr_piece == null) return false;
    
    // Check if the move is possible
    let possible_moves = curr_piece.get_possible_moves(r_src, c_src);
    for(let move in possible_moves) {
      if(move[0] == r_dest && move[1] == c_dest) {
        this.move(r_src, c_src, r_dest, c_dest);
        return true;
      }
    }
    return false;
  }

  /**
   * Promotes piece of specified tile to specified piece
   * @param { int } r - row of the tile
   * @param { int } c - column of the tile
   * @param { string } piece_type - piece to promote to
   * @returns { Bool } - true if piece was promoted; false otherwise
   */
  promote(r, c, piece_type) {
    piece_type = piece_type.toLowerCase();
    let piece_color = this.get_tile(r, c).get_color();
    let piece = null;
    switch(piece_type) {
      case "queen":
        piece = new Queen(piece_color);
        break;
      case "rook":
        piece = new Rook(piece_color);
        break;
      case "bishop":
        piece = new Bishop(piece_color);
        break;
      case "knight":
        piece = new Knight(piece_color);
        break;
      default:
        return false;
    }
    this.set_tile(piece,r,c);
    return true;
  }

  /**
   * Checks whether checkmate occured
   * returns { Bool } - true if checkmate; false otherwise
   */
  is_checkmate() {}
}
