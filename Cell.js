var Cell;

Cell = function (specObj) {
  if (specObj) {
    if (specObj.number != 0) {
      this.empty = false;
      this.number = specObj.number;
      this.pair = 10 - this.number;
    }
    this.rowNumber = specObj.rowNumber;
    this.columnNumber = specObj.columnNumber;
  }
};

Cell.prototype.empty = true;
Cell.prototype.number = 0;
Cell.prototype.pair = 0;

Cell.prototype.isEmpty = function () {
  return this.empty;
};

Cell.prototype.print = function () {
  var n;
  if (this.number) {
    n = this.number;
  }
  else {
    n = '__';
  }
  
  console.log(this.rowNumber + ', ' + this.columnNumber + ': ' + n);
};

Cell.prototype.matches = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    return (this.number === c2.number) || (this.number === c2.pair) || (this.pair === c2.number);
  }
}

Cell.prototype.sameColumn = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    return this.columnNumber === c2.columnNumber;
  }
}

Cell.prototype.sameRow = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    return this.rowNumber === c2.rowNumber;
  }
}

Cell.prototype.getNumber = function () {
  var ret = this.number || '_';
  return ret;
};

Cell.prototype.remove = function () {
  this.empty = true;
  this.number = 0;
  this.pair = 0;
  return this;
};

//module.exports = Cell;