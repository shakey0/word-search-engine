/**
 * Word Search Generator
 * Generates words on a board according to specified alignment rules
 */

/**
 * Main function to generate words on a board
 * @param {Object} boardSize - Object with width and height properties
 * @param {string[]} words - Array of words to place on the board
 * @param {Object} alignment - Object containing lines and direction configuration
 * @returns {string[][]} 2D array representing the board with words placed
 */
function generateWordsOnBoard(boardSize, words, alignment) {
  validateInputs(boardSize, words, alignment);
  
  // Initialize empty board
  const board = createEmptyBoard(boardSize);
  
  // Process each word
  for (const word of words) {
    const placementResult = placeWordOnBoard(board, word, alignment, boardSize);
    if (!placementResult.success) {
      console.warn(`Could not place word: ${word}`);
    }
  }
  
  return board;
}

/**
 * Validates input parameters
 */
function validateInputs(boardSize, words, alignment) {
  if (!boardSize || typeof boardSize.width !== 'number' || typeof boardSize.height !== 'number') {
    throw new Error('boardSize must be an object with numeric width and height properties');
  }
  
  if (!Array.isArray(words)) {
    throw new Error('words must be an array');
  }
  
  if (!alignment || !alignment.lines || typeof alignment.direction !== 'string') {
    throw new Error('alignment must have lines object and direction string');
  }
  
  // Check for invalid word lengths when block mode is enabled
  if (alignment.lines.block) {
    const invalidLengths = [3, 5, 7, 11, 13];
    for (const word of words) {
      if (invalidLengths.includes(word.length)) {
        throw new Error(`Word "${word}" has invalid length ${word.length} for block mode. Lengths 3, 5, 7, 11, 13 are not allowed.`);
      }
    }
  }
}

/**
 * Creates an empty board filled with empty strings
 */
function createEmptyBoard(boardSize) {
  const board = [];
  for (let row = 0; row < boardSize.height; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize.width; col++) {
      board[row][col] = '';
    }
  }
  return board;
}

/**
 * Attempts to place a word on the board
 */
function placeWordOnBoard(board, word, alignment, boardSize) {
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Get all possible placements for this word
    const placements = generatePossiblePlacements(word, alignment, boardSize);
    
    if (placements.length === 0) {
      return { success: false, reason: 'No valid placements found' };
    }
    
    // Try a random placement
    const placement = placements[Math.floor(Math.random() * placements.length)];
    
    if (canPlaceWord(board, word, placement, alignment.direction)) {
      placeWord(board, word, placement, alignment.direction);
      return { success: true };
    }
  }
  
  return { success: false, reason: 'Could not find valid placement after maximum attempts' };
}

/**
 * Generates all possible placements for a word based on alignment settings
 */
function generatePossiblePlacements(word, alignment, boardSize) {
  const placements = [];
  const lines = alignment.lines;
  
  // Generate placements for each enabled line type
  if (lines.horizontal) {
    placements.push(...generateHorizontalPlacements(word, boardSize));
  }
  
  if (lines.vertical) {
    placements.push(...generateVerticalPlacements(word, boardSize));
  }
  
  if (lines.diagonal) {
    placements.push(...generateDiagonalPlacements(word, boardSize));
  }
  
  if (lines.bendsStraight) {
    placements.push(...generateBendStraightPlacements(word, boardSize));
  }
  
  if (lines.bendsDiagonal) {
    placements.push(...generateBendDiagonalPlacements(word, boardSize));
  }
  
  if (lines.block) {
    placements.push(...generateBlockPlacements(word, boardSize));
  }
  
  return placements;
}

/**
 * Generate horizontal line placements
 */
function generateHorizontalPlacements(word, boardSize) {
  const placements = [];
  
  for (let row = 0; row < boardSize.height; row++) {
    for (let col = 0; col <= boardSize.width - word.length; col++) {
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        positions.push({ row, col: col + i });
      }
      placements.push({ type: 'horizontal', positions });
    }
  }
  
  return placements;
}

/**
 * Generate vertical line placements
 */
function generateVerticalPlacements(word, boardSize) {
  const placements = [];
  
  for (let row = 0; row <= boardSize.height - word.length; row++) {
    for (let col = 0; col < boardSize.width; col++) {
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        positions.push({ row: row + i, col });
      }
      placements.push({ type: 'vertical', positions });
    }
  }
  
  return placements;
}

/**
 * Generate diagonal line placements
 */
function generateDiagonalPlacements(word, boardSize) {
  const placements = [];
  
  // Top-left to bottom-right diagonal
  for (let row = 0; row <= boardSize.height - word.length; row++) {
    for (let col = 0; col <= boardSize.width - word.length; col++) {
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        positions.push({ row: row + i, col: col + i });
      }
      placements.push({ type: 'diagonal-down', positions });
    }
  }
  
  // Top-right to bottom-left diagonal
  for (let row = 0; row <= boardSize.height - word.length; row++) {
    for (let col = word.length - 1; col < boardSize.width; col++) {
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        positions.push({ row: row + i, col: col - i });
      }
      placements.push({ type: 'diagonal-up', positions });
    }
  }
  
  return placements;
}

/**
 * Generate bend straight placements (L-shaped and similar)
 */
function generateBendStraightPlacements(word, boardSize) {
  const placements = [];
  
  // Generate L-shaped placements
  for (let startRow = 0; startRow < boardSize.height; startRow++) {
    for (let startCol = 0; startCol < boardSize.width; startCol++) {
      // Try different bend points
      for (let bendPoint = 1; bendPoint < word.length; bendPoint++) {
        // Horizontal then vertical
        if (startCol + bendPoint < boardSize.width && 
          startRow + (word.length - bendPoint) < boardSize.height) {
          const positions = [];
          // Horizontal part
          for (let i = 0; i < bendPoint; i++) {
            positions.push({ row: startRow, col: startCol + i });
          }
          // Vertical part
          for (let i = bendPoint; i < word.length; i++) {
            positions.push({ row: startRow + (i - bendPoint + 1), col: startCol + bendPoint - 1 });
          }
          placements.push({ type: 'bend-straight-hv', positions });
        }
        
        // Vertical then horizontal
        if (startRow + bendPoint < boardSize.height && 
          startCol + (word.length - bendPoint) < boardSize.width) {
          const positions = [];
          // Vertical part
          for (let i = 0; i < bendPoint; i++) {
            positions.push({ row: startRow + i, col: startCol });
          }
          // Horizontal part
          for (let i = bendPoint; i < word.length; i++) {
            positions.push({ row: startRow + bendPoint - 1, col: startCol + (i - bendPoint + 1) });
          }
          placements.push({ type: 'bend-straight-vh', positions });
        }
      }
    }
  }
  
  return placements;
}

/**
 * Generate bend diagonal placements
 */
function generateBendDiagonalPlacements(word, boardSize) {
  const placements = [];
  
  // Generate diagonal bend placements (simplified implementation)
  for (let startRow = 0; startRow < boardSize.height; startRow++) {
    for (let startCol = 0; startCol < boardSize.width; startCol++) {
      for (let bendPoint = 1; bendPoint < word.length; bendPoint++) {
        // Diagonal down then diagonal up
        if (isValidDiagonalBend(startRow, startCol, bendPoint, word.length, boardSize, 'down-up')) {
          const positions = generateDiagonalBendPositions(startRow, startCol, bendPoint, word.length, 'down-up');
          if (positions.every(pos => isValidPosition(pos, boardSize))) {
            placements.push({ type: 'bend-diagonal-down-up', positions });
          }
        }
      }
    }
  }
  
  return placements;
}

/**
 * Generate block placements
 */
function generateBlockPlacements(word, boardSize) {
  const placements = [];
  const wordLength = word.length;
  
  // Get valid block dimensions for this word length
  const validBlocks = getValidBlockDimensions(wordLength);
  
  for (const block of validBlocks) {
    const { width: blockWidth, height: blockHeight } = block;
    
    // Try all possible positions for this block
    for (let startRow = 0; startRow <= boardSize.height - blockHeight; startRow++) {
      for (let startCol = 0; startCol <= boardSize.width - blockWidth; startCol++) {
        const positions = generateBlockPositions(startRow, startCol, blockWidth, blockHeight, wordLength);
        placements.push({ type: 'block', positions, blockDimensions: block });
      }
    }
  }
  
  return placements;
}

/**
 * Get valid block dimensions for a given word length
 */
function getValidBlockDimensions(wordLength) {
  const validBlocks = [];
  
  // Square blocks
  if (wordLength === 4) validBlocks.push({ width: 2, height: 2 });
  if (wordLength === 9) validBlocks.push({ width: 3, height: 3 });
  if (wordLength === 16) validBlocks.push({ width: 4, height: 4 });
  
  // Rectangular blocks
  if (wordLength === 6) {
    validBlocks.push({ width: 2, height: 3 }, { width: 3, height: 2 });
  }
  if (wordLength === 8) {
    validBlocks.push({ width: 2, height: 4 }, { width: 4, height: 2 });
  }
  if (wordLength === 10) {
    validBlocks.push({ width: 2, height: 5 }, { width: 5, height: 2 });
  }
  if (wordLength === 12) {
    validBlocks.push({ width: 2, height: 6 }, { width: 6, height: 2 }, 
             { width: 3, height: 4 }, { width: 4, height: 3 });
  }
  if (wordLength === 14) {
    validBlocks.push({ width: 2, height: 7 }, { width: 7, height: 2 });
  }
  if (wordLength === 15) {
    validBlocks.push({ width: 3, height: 5 }, { width: 5, height: 3 });
  }
  if (wordLength === 16) {
    validBlocks.push({ width: 2, height: 8 }, { width: 8, height: 2 });
  }
  
  return validBlocks;
}

/**
 * Generate positions within a block (reading order)
 */
function generateBlockPositions(startRow, startCol, blockWidth, blockHeight, wordLength) {
  const positions = [];
  
  // Fill block in reading order (left to right, top to bottom)
  for (let row = 0; row < blockHeight; row++) {
    for (let col = 0; col < blockWidth; col++) {
      if (positions.length < wordLength) {
        positions.push({ 
          row: startRow + row, 
          col: startCol + col 
        });
      }
    }
  }
  
  return positions;
}

/**
 * Helper functions for diagonal bends
 */
function isValidDiagonalBend(startRow, startCol, bendPoint, wordLength, boardSize, direction) {
  // Simplified validation - in practice you'd want more sophisticated logic
  return startRow >= 0 && startCol >= 0 && 
       startRow < boardSize.height && startCol < boardSize.width;
}

function generateDiagonalBendPositions(startRow, startCol, bendPoint, wordLength, direction) {
  const positions = [];
  // Simplified implementation - you would implement the actual diagonal bend logic here
  positions.push({ row: startRow, col: startCol });
  return positions;
}

function isValidPosition(pos, boardSize) {
  return pos.row >= 0 && pos.row < boardSize.height && 
       pos.col >= 0 && pos.col < boardSize.width;
}

/**
 * Check if a word can be placed at the given positions
 */
function canPlaceWord(board, word, placement, direction) {
  const positions = placement.positions;
  
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const currentCell = board[pos.row][pos.col];
    
    // Get the letter that should be placed here
    let expectedLetter = getLetterForPosition(word, i, direction);
    
    // If cell is not empty, check if it matches
    if (currentCell !== '' && currentCell !== expectedLetter) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get the letter that should be placed at a specific position
 */
function getLetterForPosition(word, index, direction) {
  switch (direction) {
    case 'forward':
      return word[index];
    case 'backward':
      return word[word.length - 1 - index];
    case 'forwardBackward':
      // Randomly choose forward or backward (in practice you might want deterministic logic)
      return Math.random() < 0.5 ? word[index] : word[word.length - 1 - index];
    case 'scatter':
      // For scatter, we need a different approach - this is a simplified implementation
      const shuffledWord = word.split('').sort(() => Math.random() - 0.5).join('');
      return shuffledWord[index];
    default:
      return word[index];
  }
}

/**
 * Place a word on the board at the given positions
 */
function placeWord(board, word, placement, direction) {
  const positions = placement.positions;
  
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const letter = getLetterForPosition(word, i, direction);
    board[pos.row][pos.col] = letter;
  }
}

module.exports = { generateWordsOnBoard };
