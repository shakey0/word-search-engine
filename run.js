const { generateWordsOnBoard } = require('./src/generateWordsOnBoard');
const { displayBoard, displayBoardCompact } = require('./displayBoard');

const board = generateWordsOnBoard(
  { width: 15, height: 15 },
  [
    'COLOSSEUM', 'ROBOT', 'JAVASCRIPT', 'RANDOM', 'PANDA', 'KANGAROO', 'WOMBAT', 'KOALA', 'PORTAL', 'IGLOO', 'AUTONOMY',
    'ADVOCATE', 'BATHROOM', 'NATIONAL', 'NOTEBOOK', 'PROTOCOL', 'TOMORROW', 'RATIONAL', 'LOCATION', 'COLONIAL'
  ],
  {
    lines: {
      horizontal: true,
      vertical: true,
      diagonal: false,
      bendsStraight: false,
      bendsDiagonal: false,
      block: false
    },
    direction: 'scatter'
  }
);

// Different visualization options:

// 1. Compact view (simplest)
displayBoardCompact(board);

// // 2. Grid view with borders
// displayBoard(board, { 
//   showGrid: true, 
//   emptyChar: '·' 
// });

// // 3. With coordinates for debugging
// displayBoard(board, { 
//   showCoordinates: true, 
//   emptyChar: '·',
//   showGrid: false
// });

// // 4. Custom empty character
// displayBoardCompact(board, '□');
