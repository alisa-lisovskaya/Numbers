var Row;

/** @param cell Array<Number> */

Row = function (numbers, r) {
  var c, i;
  this.cells = [];
  if (numbers) {
    for (i = 0; i < 10; i++) {
      c = new Cell({number: numbers[i], columnNumber: i, rowNumber: r});
      this.cells.push(c);
    }
  }
};

Row.prototype.isEmpty = function () {
  var i;
  
  for (i = 0; i < 10; i++) {
    if (!this.cells[i].isEmpty()) { return false; }
  }
  return true;
};

// Sets row number to one lower and recalculates it for all cells in row
Row.prototype.resetRowNumber = function () {
  var i;
  
  for (i = 0; i < 10; i++) {
    this.cells[i].rowNumber -= 1;
  }
};

// Gets the first empty cell to start refilling from
Row.prototype.getStartingEmptyCell = function () {
  var i;
  
  console.log("starting search");
  
  for (i = 9; i >= 0; i--) {
    console.log("checking " + i);
    if (!this.cells[i].isEmpty()) { 
      this.cells[i].print();
      return i+1;
    }
  }
  return 0;
};

Row.prototype.noCellsRight = function (c) {
  var i = c.columnNumber;
  
  console.log("search right from " + i);
  if (i === 9) { return true; }
  
  for (i++; i < 10; i++) {
    console.log("Checking " + i);
    if (!this.cells[i].isEmpty()) { 
      return false;
    }
  }
  return true;
};

Row.prototype.noCellsLeft = function (c) {
  var i = c.columnNumber;
  
  console.log("search left from " + i);
  if (i === 0) { return true; }
  
  for (i--; i >= 0; i--) {
    console.log("Checking " + i);
    if (!this.cells[i].isEmpty()) { 
      return false;
    }
  }
  return true;
};
  
//module.exports = Row;