import $ from 'jquery';
import io from 'socket.io-client';
import config from './config';
import Chess from 'chess.js';
import ChessBoard from 'chessboardjs';

window.$ = $;

let board = ChessBoard('board'),
  game = Chess.Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn'),
  ownColor = undefined;

window.game = game;
window.board = board;

const onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      (game.turn() !== game.player)){
    return false;
  }
};

const onDrop = function(source, target) {
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  socket.emit('move', {move: move.san});
  updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
const onSnapEnd = function() {
  board.position(game.fen());
};

const updateStatus = function() {
  let status = '';

  let moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn({ max_width: 5, newline_char: '<br />' }));
};

const startGame = function(options) {
  const cfg = {
    draggable: true,
    orientation: options.orientation,
    pieceTheme: 'images/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };

  board = ChessBoard('board', cfg);
  board.orientation(options.orientation);
  game.player = options.orientation.charAt(0);
  $(window).resize(board.resize);
  updateStatus();
}

// Socket stuff
const socket = io(config.SERVER_URL);

socket.on('game created', function(data) {
  if (data.game.id) {
    $('#game-id').html(' ' + data.game.id);
  }
});

socket.on('game joined', function(data) {
  ownColor = data.player.color;
  $('#game-id').html(' ' + data.game.id);
});

socket.on('game started', function() {
  startGame({
    position: 'start',
    orientation: ownColor
  })
  $('#restart-game').show();
});

socket.on('move', function(data) {
  const move = game.move(data.move);
  board.move(`${move.from}-${move.to}`);
  updateStatus();
});

socket.on('restart', function() {
  startGame({
    position: 'start',
    orientation: ownColor
  });
})

// Button stuff
$('#host-game').click(function() {
  socket.emit('new game');
  $('#status').html('Waiting for other player');
});

$('#join-game').click(function() {
  const gameName = $('#join-input').val();
  if (gameName !== '') {
    $('#status').html('Joining');
    socket.emit('join game', {game: gameName});
  }
});

$('#restart-game').click(function() {
  socket.emit('restart');
  startGame({
    position: 'start',
    orientation: ownColor
  });
});

$('#status').html('Host or join game');
