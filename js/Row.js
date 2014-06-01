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
  
//module.exports = Row;