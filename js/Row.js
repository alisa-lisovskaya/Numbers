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
    console.log("IN ROW resetting ");
    this.cells[i].print();
    this.cells[i].rowNumber -= 1;
    this.cells[i].print();
  }
};
  
//module.exports = Row;