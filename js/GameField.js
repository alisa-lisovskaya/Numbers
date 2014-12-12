var GameField,
    ROW_LENGTH = 9;

GameField = function (rand) {
  this.setUp(rand);
};

GameField.prototype.won = false;

// Is the game won?
GameField.prototype.isWon = function () {
  return this.won;
};

// Updates row count, oddly enough
GameField.prototype.updateRowCount = function () {
  this.rowCount = this.rows.length;
  if (this.rowCount === 0) {
    this.won = true;
  }
};

// Gets cell by id with row:column
GameField.prototype.getCell = function (id) {
  var n;
  n = id.split(':');
  return this.rows[n[0]].cells[n[1]];
};

// Checks if cells can be matched and removes them if they can
GameField.prototype.matchCells = function (id1, id2) {
  var c1, c2, higherCell, lowerCell;
  
  c1 = this.getCell(id1);
  c2 = this.getCell(id2);
  
  if (c1.matches(c2)) {
    if ((c1.sameRow(c2) && this.noCellsBetweenInRow(c1, c2)) || 
        (c1.sameColumn(c2) && this.noCellsBetweenInColumn(c1, c2))) {
      this.matched(c1, c2);
      return true;
    }
    else {
      if (c1.rowNumber < c2.rowNumber) {
        higherCell = c1;
        lowerCell = c2;
      }
      else {
        higherCell = c2;
        lowerCell = c1;
      }
      
      if ((higherCell.rowNumber === lowerCell.rowNumber-1) && 
            this.rows[higherCell.rowNumber].noCellsRight(higherCell) && 
            this.rows[lowerCell.rowNumber].noCellsLeft(lowerCell)) {
        this.matched(c1, c2);
        return true;
      }
    }
  }
  return false;
};

// Checks if all cells between c1 and c2 are empty, column-wise
GameField.prototype.noCellsBetweenInColumn = function (c1, c2) {
  var i, row1, row2,
      column = c1.columnNumber;
  
  if (c1.rowNumber < c2.rowNumber) {
    row1 = c1.rowNumber;
    row2 = c2.rowNumber;
  }
  else if (c1.rowNumber > c2.rowNumber) {
    row1 = c2.rowNumber;
    row2 = c1.rowNumber;
  }
  else { return false; }
  
  // if neighbours
  if (row1+1 === row2) { return true; }
  
  else {
    for (i = row1+1; i < row2; i++) {
      if (!this.rows[i].cells[column].isEmpty()) { return false; }
    }
  }
  return true;
};

// Checks if all cells between c1 and c2 are empty, row-wise
GameField.prototype.noCellsBetweenInRow = function (c1, c2) {
  var i, column1, column2,
      row = c1.rowNumber;
  
  if (c1.columnNumber < c2.columnNumber) {
    column1 = c1.columnNumber;
    column2 = c2.columnNumber;
  }
  else if (c1.columnNumber > c2.columnNumber) {
    column1 = c2.columnNumber;
    column2 = c1.columnNumber;
  }
  else { return false; }
  
  // if neighbours
  if (column1+1 === column2) { return true; }
  
  else {
    for (i = column1+1; i < column2; i++) {
      if (!this.rows[row].cells[i].isEmpty()) { return false; }
    }
  }
  
  return true;
};

// Removes cells, removes & reindexates rows if empty
GameField.prototype.matched = function (c1, c2) {
  var rowUp, rowDown, move = {};

  move.cell1 = c1.clone();
  move.cell2 = c2.clone();
  
  c1.remove();
  c2.remove();
  
  if (c1.rowNumber > c2.rowNumber) {
    rowDown = c1.rowNumber;
    rowUp = c2.rowNumber;
  }
  else {
    rowDown = c2.rowNumber;
    rowUp = c1.rowNumber;
  }
  
  // First we delete the lower row so that row numbers are not changed
  if (this.rows[rowDown] && this.rows[rowDown].isEmpty()) {
    this.reindexRowsDelete(rowDown);
    move.rowDown = rowDown;
  }
  if (this.rows[rowUp] && this.rows[rowUp].isEmpty()) {
    this.reindexRowsDelete(rowUp);
    move.rowUp = rowUp;
  }
  
  this.updateRowCount();
  this.memory.push(move);
};

// Removes the row with number r and decrements the numbers of all rows after it
GameField.prototype.reindexRowsDelete = function (r) {
  var i = r;
  
  this.rows.splice(r,1);
  
  if (this.rows[i]) {
    for (i; i < this.rows.length; i++) {
      this.rows[i].rowNumberDecrement();
    }
  }
};

// Increments the numbers of all rows starting with r
GameField.prototype.reindexRowsInsert = function (r) {
  var i = r;
  
  if (this.rows[i]) {
    for (i; i < this.rows.length; i++) {
      this.rows[i].rowNumberIncrement();
    }
  }
};

// Adds more numbers
GameField.prototype.addMore = function () {
  var r, i, start, numbers;
  
  r = this.rows.length-1;  // row number to start adding with
  start = this.rows[r].getStartingEmptyCell();  // cell number to start adding with
  numbers = this.getAllNumbers();

  if (numbers.length > 0) {
    // Fills the empty part of last row if needed
    while (start < 9) {
      if (i = numbers.shift()) {
        this.rows[r].cells[start].number = i;
      }
      else {
        this.rows[r].cells[start].number = 0;
      }
      start++;
    }
  
    r++;
  
    this.fillRows(r, numbers);
  }
  
  this.updateRowCount();
  this.memory = [];
};

// Restores the last removed pair to the field
GameField.prototype.restore = function () {
  var move, c1, c2, canRestore = (this.memory.length > 0);
  
  if (canRestore) {
    move = this.memory.pop();
    
    c1 = move.cell1;
    c2 = move.cell2;
    
    // if rows have been deleted, they need to be restored
    if (move.rowUp) { 
      this.restoreRow(move.rowUp);
    }
    if (move.rowDown) {
      this.restoreRow(move.rowDown);
    }
    
    // now cells can be restored in the rows they've been in
    this.rows[c1.rowNumber].cells[c1.columnNumber] = c1;
    this.rows[c2.rowNumber].cells[c2.columnNumber] = c2;
  }
  
  this.updateRowCount();

  return canRestore;
};

// Restores the row with the given number (filled with empty cells)
GameField.prototype.restoreRow = function (rowNumber) {
  this.reindexRowsInsert(rowNumber);
  this.rows.splice(rowNumber, 0, new Row ([], rowNumber));
};

// Pushes new rows with numbers from number array starting with startRow
GameField.prototype.fillRows = function (startRow, numbers) {
  var i, ar;
  
  while (numbers.length > 0) {
    ar = [];
    for (i = 0; i < 9; i++) {
      if (numbers.length > 0) {
        ar.push(numbers.shift());
      }
      else {
        ar.push(0);
      }
    }
    
    this.rows.push(new Row(ar, startRow));
    startRow++;
  }
};

// Gets all numbers from the field
GameField.prototype.getAllNumbers = function () {
  var numbers = [];
  
  for (i in this.rows) {
    for (j in this.rows[i].cells) {
      if (!this.rows[i].cells[j].isEmpty()) {
        numbers.push(this.rows[i].cells[j].number);
      }
    }
  }

  return numbers;
};

// Returns an array of 9 random numbers
GameField.prototype.randomNumbers = function () {
  var i, n, ret = [];

  for (i = 0; i < ROW_LENGTH; i++) {
    n = Math.floor(Math.random()*9+1);
    while (n === ret[i-1]) {
      n = Math.floor(Math.random()*9+1);
    }
    ret.push(n);
  }

  return ret;
};

// Sets up initial state of the game
GameField.prototype.setUp = function (rand) {
  var r, i;
  
  this.rowCount = 0;
  this.rows = [];
  this.memory = [];

  this.randomMode = rand | false;

  if (this.randomMode) {
    for (i = 0; i < 4; i++) {
      r = new Row(this.randomNumbers(),i);
      this.rows.push(r);
    }
  }

  else {
    r = new Row([1,2,3,4,5,6,7,8,9], 0);
    this.rows.push(r);
    r = new Row([1,1,1,1,2,1,3,1,4], 1);
    this.rows.push(r);
    r = new Row([1,5,1,6,1,7,1,8,1], 2);
    this.rows.push(r);
    r = new Row([9,0,0,0,0,0,0,0,0], 3);
    this.rows.push(r);
  }

  this.updateRowCount();
};