var GameField;

/*  TODO  hint()  <--- how should the possible moves be stored
    TODO  score() <--- make score awesumer, with blinking flashing lights, music, and confetti
    TODO  highScore() <--- save in localStorage unless this is not considered nice
  */

GameField = function () {
  this.setUp();
};

GameField.prototype.score = 0;

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
      //console.log("Cell empty: ");
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
  var move = {};
  
  this.score += c1.number;
  this.score += c2.number;
    
  move.cell1 = c1.clone();
  move.cell2 = c2.clone();
  
  c1.remove();
  c2.remove();
  
  if (c1.rowNumber && this.rows[c1.rowNumber].isEmpty()) {
    this.reindexRowsDelete(c1.rowNumber);
    move.row1 = c1.rowNumber;
  }
  if (this.rows[c2.rowNumber]) {
    if (this.rows[c2.rowNumber].isEmpty()) {
      this.reindexRowsDelete(c2.rowNumber);
      // The rows must be in ascending order!
      if (move.row1) {
        if (move.row1 > c2.rowNumber) {
          move.row2 = move.row1;
          move.row1 = c2.rowNumber;
        }
        else {
          move.row2 = c2.rowNumber;
        }
      }
      else {
        move.row1 = c2.rowNumber;
      }
    }
  }
  
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
  
  console.log("Inserting after row " + r);
  if (this.rows[i]) {
    for (i; i < this.rows.length; i++) {
      console.log("incrementing " + i);
      this.rows[i].rowNumberIncrement();
    }
  }
};

// Adds more numbers
GameField.prototype.addMore = function () {
  var r, i, j, start, numbers;
  
  r = this.rows.length-1;  // row number to start adding with
  start = this.rows[r].getStartingEmptyCell();  // cell number to start edding with
  numbers = this.getAllNumbers();
  
  if (numbers.length > 0) {
    // Fills the empty part of last row if needed
    while (start < 9) {
      this.rows[r].cells[start].number = numbers.shift();
      start++;
    }
  
    r++;
  
    this.fillRows(r, numbers);
  }
  
  this.memory = [];
};

// Restores the last removed pair to the field
GameField.prototype.restore = function () {
  var move, c1, c2;
  
  console.log(JSON.stringify(this.memory));
  
  if (this.memory.length > 0) {
    move = this.memory.pop();
    
    c1 = move.cell1;
    c2 = move.cell2;
    
    // if rows have been deleted, they need to be restored
    if (move.row1) {
      this.reindexRowsInsert(move.row1);
      this.rows.splice(move.row1, 0, new Row ([], move.row1));
    }
    if (move.row2) {
      this.reindexRowsInsert(move.row2);
      this.rows.splice(move.row2, 0, new Row ([], move.row2));
    }
    
    // now cells can be restored in the rows they've been in
    this.rows[c1.rowNumber].cells[c1.columnNumber] = c1;
    this.rows[c2.rowNumber].cells[c2.columnNumber] = c2;
  }
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
  
  r = new Row([1,2,3,4,5,6,7,8,9], 0);
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
  this.rows.push(r);
}

//module.exports = GameField;