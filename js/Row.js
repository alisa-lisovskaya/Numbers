var Row;

/** @param cell Array<Number> */

Row = function (numbers, r) {
  var c, i;
  this.cells = [];
  if (numbers) {
    this.empty = false;
    for (i = 0; i < 10; i++) {
      c = new Cell({number: numbers[i], columnNumber: i, rowNumber: r});
      this.cells.push(c);
    }
  }
};

Row.prototype.empty = true;

Row.prototype.isEmpty = function () {
  return this.empty;
};

// Sets row number to one lower and recalculates it for all cells in row
Row.prototype.resetRowNumber = function () {
  var i;
  
  for (i = 0; i < 10; i++) {
    this.cells[i].rowNumber -= 1;
  }
};
  
//module.exports = Row;