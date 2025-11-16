function displayBoard(board, options = {}) {
  const {
    emptyChar = '·',
    showGrid = true,
    showCoordinates = false
  } = options;

  console.log('\n=== WORD SEARCH BOARD ===\n');
  
  // Show column numbers if coordinates are enabled
  if (showCoordinates) {
    const colHeaders = '   ' + Array.from({ length: board[0].length }, (_, i) => 
      String(i).padStart(2)
    ).join(' ');
    console.log(colHeaders);
  }

  board.forEach((row, rowIndex) => {
    // Row number if coordinates are enabled
    const rowPrefix = showCoordinates ? String(rowIndex).padStart(2) + ' ' : '';
    
    // Process each cell in the row
    const displayRow = row.map(cell => {
      const char = cell === '' ? emptyChar : cell;
      return showGrid ? ` ${char} ` : char + ' ';
    }).join(showGrid ? '|' : '');

    // Add borders if grid is enabled
    const line = showGrid ? `${rowPrefix}|${displayRow}|` : `${rowPrefix}${displayRow}`;
    console.log(line);
    
    // Add horizontal separator for grid
    if (showGrid && rowIndex < board.length - 1) {
      const separator = rowPrefix.replace(/./g, ' ') + '+' + 
        Array(row.length).fill('---').join('+') + '+';
      console.log(separator);
    }
  });

  console.log('\n========================\n');
}

// Alternative compact display
function displayBoardCompact(board, emptyChar = '·') {
  console.log('\n=== WORD SEARCH BOARD (Compact) ===\n');
  
  board.forEach(row => {
    const line = row.map(cell => cell === '' ? emptyChar : cell).join(' ');
    console.log(line);
  });
  
  console.log('\n==================================\n');
}

// Display with word highlighting (if you want to show found words)
function displayBoardWithHighlight(board, foundWords = [], emptyChar = '·') {
  console.log('\n=== WORD SEARCH BOARD ===\n');
  
  // You can extend this to highlight found words with colors
  // For now, it's the same as compact display
  board.forEach(row => {
    const line = row.map(cell => cell === '' ? emptyChar : cell).join(' ');
    console.log(line);
  });
  
  if (foundWords.length > 0) {
    console.log('\nFound words:', foundWords.join(', '));
  }
  
  console.log('\n========================\n');
}

module.exports = { 
  displayBoard, 
  displayBoardCompact, 
  displayBoardWithHighlight 
};
