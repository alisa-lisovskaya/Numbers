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

// Checks if cell is empty
Cell.prototype.isEmpty = function () {
  return this.empty;
};

// Prints Cell contents on console
Cell.prototype.print = function () {
  console.log(this.rowNumber + ', ' + this.columnNumber + ': ' + this.number + " = " + this.isEmpty());
};

// Matches the cell to the parameter number-wise
Cell.prototype.matches = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    return (this.number === c2.number) || (this.number === c2.pair) || (this.pair === c2.number);
  }
}

// Checks if parameter cell is in the same column
Cell.prototype.sameColumn = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    if (this.columnNumber === c2.columnNumber) {
      console.log("same column!");
    }
    return this.columnNumber === c2.columnNumber;
  }
}

// Checks if parameter cell is in the same row
Cell.prototype.sameRow = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    if (this.rowNumber === c2.rowNumber) {
      console.log("same row!");
    }
    return this.rowNumber === c2.rowNumber;
  }
}

// Returns the number if any or _
Cell.prototype.getNumber = function () {
  var ret = this.number || '_';
  return ret;
};

// Removes cell making it appear empty
Cell.prototype.remove = function () {
  this.empty = true;
  this.number = 0;
  this.pair = 0;
  return this;
};

//module.exports = Cell;