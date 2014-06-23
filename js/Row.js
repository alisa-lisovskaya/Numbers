var Row;

/** @param cell Array<Number> */

Row = function (numbers, r) {
  var c, i;
  this.cells = [];
  if (numbers.length >= 9) {
    for (i = 0; i < 9; i++) {
      c = new Cell({number: numbers[i], columnNumber: i, rowNumber: r});
      this.cells.push(c);
    }
  }
  // insert empty row if less than 9 numbers provided in an array
  else {
    for (i = 0; i < 9; i++) {
      c = new Cell({number: 0, columnNumber: i, rowNumber: r});
      this.cells.push(c);
    }
  }
};

// Returns the number of non-empty cells in the row
Row.prototype.cellCount = function () {
  var i, n = 0;
  
  //console.log("counting cells");
  
  for (i = 0; i < 9; i++) {
    if (!this.cells[i].isEmpty()) { n++; }
  }
  
  return n;
};

// Checks if row is empty
Row.prototype.isEmpty = function () {
  var i;
  
  for (i = 0; i < 9; i++) {
    if (!this.cells[i].isEmpty()) { return false; }
  }
  return true;
};

// Sets row number to one lower and recalculates it for all cells in row
Row.prototype.rowNumberDecrement = function () {
  var i;
  
  for (i = 0; i < 9; i++) {
    this.cells[i].rowNumber -= 1;
  }
};

// Sets row number to one higher and recalculates it for all cells in row
Row.prototype.rowNumberIncrement = function () {
  var i;
  
  for (i = 0; i < 9; i++) {
    this.cells[i].rowNumber += 1;
  }
};

// Gets the first empty cell to start refilling from, 9 if it should be a new row
Row.prototype.getStartingEmptyCell = function () {
  var i;
  
  //console.log("starting search");
  
  for (i = 8; i >= 0; i--) {
    //console.log("checking " + i);
    if (!this.cells[i].isEmpty()) { return i+1; }
  }
  return 0;
};

// Checks if all cells to the right of c are empty
Row.prototype.noCellsRight = function (c) {
  var i = c.columnNumber;
  
  //console.log("search right from " + i);
  if (i === 8) { return true; }
  
  for (i++; i < 9; i++) {
    //console.log("Checking " + i);
    if (!this.cells[i].isEmpty()) { return false; }
  }
  return true;
};

// Checks if all cells to the left of c are empty
Row.prototype.noCellsLeft = function (c) {
  var i = c.columnNumber;
  
  //console.log("search left from " + i);
  if (i === 0) { return true; }
  
  for (i--; i >= 0; i--) {
    //console.log("Checking " + i);
    if (!this.cells[i].isEmpty()) { return false; }
  }
  return true;
};
  
//module.exports = Row;