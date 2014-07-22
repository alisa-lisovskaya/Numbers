var GameField;

/*  TODO  hint()  <--- how should the possible moves be stored
  */

GameField = function () {
  this.setUp();
};

GameField.prototype.score = 0;
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

// Updates cell count, oddly enough
GameField.prototype.updateCellCount = function () {
  var i;
  // console.log("updating cells");
  this.cellCount = 0;
  
  for (i in this.rows) {
    this.cellCount += this.rows[i].cellCount();
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
    //console.log("Cells matched");
    if ((c1.sameRow(c2) && this.noCellsBetweenInRow(c1, c2)) || (c1.sameColumn(c2) && this.noCellsBetweenInColumn(c1, c2))) {
      //console.log("Cells will be deleted");
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
      
      if ((higherCell.rowNumber === lowerCell.rowNumber-1) && this.rows[higherCell.rowNumber].noCellsRight(higherCell) && this.rows[lowerCell.rowNumber].noCellsLeft(lowerCell)) {
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
      //console.log("Cell empty: ");
    }
  }
  
  return true;
};

// Removes cells, removes & reindexates rows if empty
GameField.prototype.matched = function (c1, c2) {
  var rowUp, rowDown, move = {};
  
  this.score += c1.number;
  this.score += c2.number;
    
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
  this.updateCellCount();
  this.memory.push(move);
};

// Removes the row with number r and decrements the numbers of all rows after it
GameField.prototype.reindexRowsDelete = function (r) {
  var i = r;
  
  this.rows.splice(r,1);
  
  console.log("Deleting row " + r);
  
  if (this.rows[i]) {
    for (i; i < this.rows.length; i++) {
      console.log("decrementing " + i);
      this.rows[i].rowNumberDecrement();
    }
  }
};

// Increments the numbers of all rows starting with r
GameField.prototype.reindexRowsInsert = function (r) {
  var i = r;
  
  console.log("Inserting after row " + r);
  if (this.rows[i]) {
    for (i; i < this.rows.length; i++) {
      console.log("incrementing " + i);
      this.rows[i].rowNumberIncrement();
    }
  }
};

// Adds more numbers
//  TODO    if first cell to be filled was cleared before, it must not be filled (cf. paper version!)
//  TODO    something is wrong here, try adding 1s and behold
GameField.prototype.addMore = function () {
  var r, i, j, start, numbers;
  
  r = this.rows.length-1;  // row number to start adding with
  start = this.rows[r].getStartingEmptyCell();  // cell number to start adding with
  numbers = this.getAllNumbers();

  console.log(JSON.stringify(numbers));
  
  if (numbers.length > 0) {
    // Fills the empty part of last row if needed
    while (start < 9) {
      this.rows[r].cells[start].number = numbers.shift();
      start++;
    }
  
    r++;
  
    this.fillRows(r, numbers);
  }
  
  this.updateRowCount();
  this.updateCellCount();
  this.memory = [];
};

// Restores the last removed pair to the field
// TODO   this should be tested better, something is wrong
GameField.prototype.restore = function () {
  var move, c1, c2;
  
  console.log(JSON.stringify(this.memory));
  
  if (this.memory.length > 0) {
    move = this.memory.pop();
    
    c1 = move.cell1;
    c2 = move.cell2;
    
    // if rows have been deleted, they need to be restored
    if (move.rowUp) {
      this.reindexRowsInsert(move.rowUp);
      this.rows.splice(move.rowUp, 0, new Row ([], move.rowUp));
    }
    if (move.rowDown) {
      this.reindexRowsInsert(move.rowDown);
      this.rows.splice(move.rowDown, 0, new Row ([], move.rowDown));
    }
    
    // now cells can be restored in the rows they've been in
    this.rows[c1.rowNumber].cells[c1.columnNumber] = c1;
    this.rows[c2.rowNumber].cells[c2.columnNumber] = c2;
  }
  
  this.updateRowCount();
  this.updateCellCount();
};

// Pushes new rows with numbers from number array starting with startRow
GameField.prototype.fillRows = function (startRow, numbers) {
  var i, ar;
  
  //console.log("filling ", startRow);
  
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
        console.log("row " + i + " cell " + j + " content " + this.rows[i].cells[j].number);
        numbers.push(this.rows[i].cells[j].number);
      }
    }
  }
  
  return numbers;
};

// Returns current score
GameField.prototype.getScore = function () {
  return this.score;
};

// Returns current row count
GameField.prototype.getRowCount = function () {
  return this.rowCount;
};

// Returns current cell count
GameField.prototype.getCellCount = function () {
  return this.cellCount;
};


// Prints the gamefield contents on the console
GameField.prototype.print = function () {
  var i, j;
  for (i in this.rows) {
   for (j in this.rows[i].cells) {
     this.rows[i].cells[j].print();
   }
 }
};


// Sets up initial state of the game
GameField.prototype.setUp = function () {
  var r;
  
  this.rows = [];
  this.memory = [];
  this.score = 0;
  
  r = new Row([0,0,9,0,0,0,1,0,0], 0);
  this.rows.push(r);
  r = new Row([0,0,9,0,0,0,1,0,0], 1);
  this.rows.push(r);
  
  /*r = new Row([1,2,3,4,5,6,7,8,9], 0);
  this.rows.push(r);
  r = new Row([1,1,1,1,2,1,3,1,4], 1);
  this.rows.push(r);
  r = new Row([0,0,9,0,0,0,1,0,0], 2);  // temp
  this.rows.push(r);
  r = new Row([0,0,1,0,0,0,9,0,0], 3);  // temp
  this.rows.push(r);
  r = new Row([1,5,1,6,1,7,1,8,1], 4);
  this.rows.push(r);
  r = new Row([9,0,0,0,0,0,0,0,0], 5);
  this.rows.push(r);*/
  
  this.updateRowCount();
  this.updateCellCount();
}

//module.exports = GameField;