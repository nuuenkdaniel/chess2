class Piece {
  constructor(color) {
    if(constructor == Piece) throw new error("Abstract classes can't be instantiated.");
    this.color = color;
  }
  get_color() { return this.color }
  set_color(color) { this.color = color }

  /**
   * Removes all moves that cause check on the board
   * @param { int } r_src - the current row the piece is on
   * @param { int } c_src - the current column the piece is on
   * @param { int[][] } possible_moves - possible_moves of the piece
   * @returns { int[][] } - the possible_moves that won't cause the king to be checked
   * @board { Chess_board } board - the chess board
   */
  remove_check(r_src, c_src, possible_moves, board) {
    let curr_piece = board.get_tile(r_src, c_src);
    board.set_tile(null, r_src, c_src);
    let temp_moves = [];
    let temp_piece = null;
    let king = (this.get_color() == "black")? board.get_white_king() : board.get_black_king;
    for(let i = 0; i < possible_moves.length; i++) {
      // Save whatever was on the tile being replace
      temp_piece = board.get_tile(possible_moves[i][0], possible_moves[i][1]);
      board.set_tile(curr_piece, possible_moves[i][0], possible_moves[i][1]);
      king.get_all_visible_tiles(board);
      if(!king.is_checked()) temp_moves.push(possible_moves[i]);
      // Place the removed piece back
      board.set_tile(temp_piece, possible_moves[i][0], possible_moves[i][1]);
    }

    // Return everything back
    board.set_tile(curr_piece, r_src, c_src);
    king.get_all_visible_tiles(board);

    return temp_moves;
  }

  // Returns all visible tiles of a piece
  get_visible_tiles(r, c, board) { throw new error("Method 'get_visible_tiles(r, c, board)' must be implemented") }

  // Returns all the possible moves of a piece
  get_possible_moves(r, c, board) { throw new error("Method 'calc_possible_moves(r, c, board)' must be implemented") }
  get_piece() { throw new error("Method 'get_piece()' must be implemented") }
}

class King extends Piece {
  constructor(color, board_length, board_width) {
    super(color);
    this.first_move = true;
    this.visible_tiles = [];
    // Initialize visible tiles board to 0
    for(let i = 0; i < board_length(); i++) {
      this.visible_tiles[i] = [];
      for(let j = 0; j < board_width(); j++) {
        this.visible_tiles[i][j] = 0;
      }
    }
  }

  // Get all visible tiles from the opposite color pieces
  get_all_visible_tiles(board) {
    let visible_tiles = [];
    for(let i = 0; i < board.get_length(); i++) {
      for(let j = 0; j < board.get_width(); j++) {
        if(board.get_tile(i,j).get_color() != this.color) {
          visible_tiles = board.get_tile(i,j).get_visible_tiles(i, j, board);
        }
        for(let k = 0; k < visible_tiles.length; k++) {
          this.visible_tiles[visible_tiles[k][0]][visible_tiles[k][1]] = 1;
        }
      }
    }
    return this.visible_tiles;
  }

  get_visible_tiles(r, c, board) {
    let visible_tiles = [[r+1,c-1],[r+1,c],[r+1,c+1],[r,c+1],
      [r-1,c+1],[r-1,c],[r-1,c-1],[r,c-1]];
    let return_tiles = [];
    // Check if tiles are out of bounds
    for(let i = 0; i < visible_tiles.length; i++) {
      if(visible_tiles[i][0] < board.get_length() && visible_tiles[i][0] >= 0 &&
        visible_tiles[i][1] < board.get_width() && visible_tiles[i][1] >= 0) {
        return_tiles.push(visible_tiles[i]);
      }
    }
    return return_tiles;
  }

  is_checked(r, c) { return (this.visible_tiles[r][c])? true : false }

  get_possible_moves(r, c, board) {
    let possible_moves = this.get_visible_tiles(r,c,board);

    // Check if visible tiles have pieces on them
    let temp;
    let temp_moves = [];
    for(let i = 0; i < possible_moves.length; i++) {
      temp = board.get_tile(possible_moves[i][0], possible_moves[i][1]);
      if(temp == null || temp.get_color() != this.color) temp_moves.push(temp);
    }
    possible_moves = temp;

    // Check if can castle
    if(this.get_first_move() && !this.is_checked()) {
      let col_offset = 0;
      // Check castle left
      while(c+col_offset > 0 && board.get_tile(r,c+col_offset) == null) col_offset--;
      if(board.get_tile(r, c+col_offset) != null &&
        board.get_tile(r, c+col_offset).get_piece() == "rook" &&
        board.get_tile(r, c+col_offset).get_first_move()) possible_moves.push([r,c-2]);
      // Check castle right
      col_offset = 0;
      while(c+col_offset < board.get_length()-1 && board.get_tile(r,c+col_offset) == null) col_offset++;
      if(board.get_tile(r, c+col_offset) != null &&
        board.get_tile(r, c+col_offset).get_piece() == "rook" &&
        board.get_tile(r, c+col_offset).get_first_move()) possible_moves.push([r,c+2]);
    }

    // Check if possible moves causes a check
    possible_moves = this.remove_check(r, c, possible_moves, board);

    return possible_moves;
  }

  get_first_move() { return this.first_move }
  set_first_move(first_move) { this.first_move = first_move }
  get_piece() { return "king" }
}

// Pawn Class
class Pawn extends Piece {
  constructor(color) {
    super(color);
    this.first_move = true;
  }

  get_first_move() { return this.first_move }
  set_first_move(first_move) { this.first_move = first_move }

  get_visible_tiles(r, c, board) {
    let visible_tiles = [];
    let move = (this.color == "black")? 1:-1;
    if(r+move < board.get_length() && r+move >= 0) {
      if(c-1 >= 0) visible_tiles.push([r+move,c-1]);
      if(c+1 < board.get_width()) visible_tiles.push([r+move,c+1]);
    }
    return visible_tiles;
  }

  /**
   * Returns all possible moves of the pawn in the context of the board
   * @param {int} r - row on the board the pawn is on
   * @param {int} c - column on the board the pawn is on
   * @returns {int[][]} - An array of possible moves
   */
  get_possible_moves(r, c, board) {
    let possible_moves = [];
    let enpassant = board.get_enpassant();
    let move = (this.color == "black")? 1:-1;
    let temp = null;

    // Check if tile in front of pawn is within bounds
    if(r+move < board.get_length() && r+move >= 0) {
      // Check if tile in front of pawn has a piece
      if(board.get_tile(r+move, c) == null) {
        possible_moves.push([r+move, c]);
        // Check if pawn can move 2
        if(this.first_move == true &&
          r+2*move < board.get_length() && r+2*move >= 0 &&
          board.get_tile(r+2*move, c) == null) possible_moves.push([r+2*move, c]);
      }

      // Check if pieces are diagnol to the pawn
      temp = (c-1 >= 0)? board.get_tile(r+move, c-1):null;
      if(temp != null && temp.get_color() != this.color) possible_moves.push(temp);
      temp = (c+1 < board.get_width())? board.get_tile(r+move, c+1):null;
      if(temp != null && temp.get_color() != this.color) possible_moves.push(temp);

      // Check if enpassant is possible
      if(enpassant.length != 0 && enpassant[0] == r && Math.abs(enpassant[1]-c) == 1) possible_moves.push([r+1*move, enpassant[1]]); 
    }

    // Check if possible moves causes a check before returning
    return this.remove_check(r, c, possible_moves, board);
  }

  get_piece() { return "pawn" }
}

// Knight Class
class Knight extends Piece {
  constructor(color) { super(color) }

  get_visible_tiles(r, c, board) {
    let visible_tiles = [[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1],[-2,-1]];
    let temp;
    let returned_tiles = [];

    for(let i = 0; i < this.possible_moves.length; i++) {
      temp = this.possible_moves.pop();
      if(temp[0] < board.get_height() && temp[0] >= 0 &&
        temp[1] < board.get_width() && temp[1] >= 0) {
        returned_tiles.push([temp[0]+r, temp[0]+c]);
      }
    }
    return returned_tiles;
  }

  get_possible_moves(r, c, board) {
    let possible_moves = this.get_visible_tiles(r, c, board);

    // Check if conflict with another piece
    let temp;
    let temp_tile;
    let returned_moves = [];
    for(let i = 0; i < this.possible_moves.length; i++) {
      temp = this.possible_moves[i];
      temp_tile = board.get_tile(temp[0], temp[1]);
      if(temp_tile == null || temp_tile.get_color() != this.color) returned_moves.push([temp[0], temp[1]]);
    }

    // Check if possible moves causes check before returning
    return this.remove_check(r, c, returned_moves, board);
  }

  get_piece() { return "knight" }
}

class Movement_piece extends Piece {
  constructor(color) {
    if(constructor == Pieces) throw new error("Abstract classes can't be instantiated.");
    super(color);
  }

  /**
   * Assists with getting all visible tiles in one direction
   * @param {int} r - current row of the piece
   * @param {int} c - current column of the piece
   * @param {int} move_r - the direction of the row the piece is moving in
   * @param {int} move_c - the direction of the column the piece is moving in
   * @returns {int[][]} - a 2d int array of the visible tiles in that direction
   */
  get_possible_moves_helper(r, c, move_r, move_c, board) {
    let i = 1;
    let temp_r = r+i*move_r;
    let temp_c = c+i*move_c;
    let possible_moves = [];
    // Keep moving in direction until stopped by piece or bounds
    while((temp_r < board.get_height() && temp_r >= 0) && 
      (temp_c < board.get_width() && temp_c >= 0)) {
      if(board.get_tile(temp_r, temp_c) != null) {
        possible_moves.push([temp_r, temp_c]);
        break;
      }
      possible_moves.push([temp_r, temp_c]);
      i++;
      temp_r = r+i*move_r;
      temp_c = c+i*move_c;
    }
    return possible_moves;
  }
}

class Rook extends Movement_piece {
  constructor(color) {
    super(color);
    this.first_move = true;
  }
  
  get_visible_tiles(r, c, board) {
    let visible_tiles = [];
    let move = [[1,0],[0,1],[-1,0],[0,-1]];
    for(let i = 0; i < move.length; i++) visible_tiles.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
    return visible_tiles;
  }

  get_possible_moves(r, c, board) {
    let possible_moves = [];
    let move = [[1,0],[0,1],[-1,0],[0,-1]];
    for(let i = 0; i < move.length; i++) {
      possible_moves.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
      // Check if the last tile has a piece of the same color
      let temp = board.get_tile(possible_moves[possible_moves.length-1][0],
        possible_moves[possible_moves.length-1][1]);
      if(possible_moves.length != 0 &&
        temp != null &&
        temp.get_color() == this.color) possible_moves.pop();
    }
    
    // Check if possible moves causes a check before returning
    return this.remove_check(r, c, possible_moves, board);
  }

  get_first_move() { return this.first_move }
  set_first_move(first_move) { this.first_move = first_move }
  get_piece() { return "rook" }
}

class Bishop extends Movement_piece {
  constructor(color) { super(color) }

  get_visible_tiles(r, c, board) {
    let visible_tiles = [];
    let move = [[1,1],[-1,1],[-1,-1],[1,-1]];
    for(let i = 0; i < move.length; i++) visible_tiles.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
    return visible_tiles;
  }

  get_possible_moves(r, c, board) {
    let possible_moves = [];
    let move = [[1,1],[-1,1],[-1,-1],[1,-1]];
    for(let i = 0; i < move.length; i++) {
      possible_moves.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
      // Check if the last tile has a piece of the same color
      let temp = board.get_tile(possible_moves[possible_moves.length-1][0],
        possible_moves[possible_moves.length-1][1]);
      if(possible_moves.length != 0 &&
        temp != null &&
        temp.get_color() == this.color) possible_moves.pop();
    }
    
    // Check if possible moves causes a check before returning
    return this.remove_check(r, c, possible_moves, board);
  }

  get_piece() { return "bishop" }
}

class Queen extends Movement_piece {
  constructor(color) { super(color) }

  get_visible_tiles(r, c, board) {
    let visible_tiles = [];
    let move = [[1,1],[-1,1],[-1,-1],[1,-1],[1,0],[0,1],[-1,0],[0,-1]];
    for(let i = 0; i < move.length; i++) visible_tiles.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
    return visible_tiles;
  }

  get_possible_moves(r, c, board) {
    let possible_moves = [];
    let move = [[1,1],[-1,1],[-1,-1],[1,-1],[1,0],[0,1],[-1,0],[0,-1]];
    for(let i = 0; i < move.length; i++) {
      possible_moves.push(this.get_possible_moves_helper(r, c, move[i][0], move[i][1], board));
      // Check if the last tile has a piece of the same color
      let temp = board.get_tile(possible_moves[possible_moves.length-1][0],
        possible_moves[possible_moves.length-1][1]);
      if(possible_moves.length != 0 &&
        temp != null &&
        temp.get_color() == this.color) possible_moves.pop();
    }
    
    // Check if possible moves causes a check before returning
    return this.remove_check(r, c, possible_moves, board);
  }

  get_piece() { return "queen" }
}

module.exports = { Piece, Pawn, Knight, Movement_piece, Rook, Bishop, Queen };
