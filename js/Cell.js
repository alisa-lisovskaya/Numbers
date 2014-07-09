var Cell;

Cell = function (specObj) {
  if (specObj) {
    this.number = specObj.number;
    this.rowNumber = specObj.rowNumber;
    this.columnNumber = specObj.columnNumber;
  }
};

// Returns a clone of the cell
Cell.prototype.clone = function () {
  var specObj = {};
  
  specObj.number = this.number;
  specObj.rowNumber = this.rowNumber;
  specObj.columnNumber = this.columnNumber;
  
  return new Cell(specObj);
};

// Checks if cell is empty
Cell.prototype.isEmpty = function () {
  return this.number === 0;
};

// Prints Cell contents on console
Cell.prototype.print = function () {
  console.log(this.rowNumber + ', ' + this.columnNumber + ': ' + this.number + " = " + this.isEmpty());
};

// Matches the cell to the parameter number-wise
Cell.prototype.matches = function (c2) {
  // console.log("matchig " + this.number + " to " + c2.number);
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    return (this.number === c2.number) || (this.number + c2.number === 10);
  }
}

// Checks if parameter cell is in the same column
Cell.prototype.sameColumn = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    /*if (this.columnNumber === c2.columnNumber) {
      console.log("same column!");
    }*/
    return this.columnNumber === c2.columnNumber;
  }
}

// Checks if parameter cell is in the same row
Cell.prototype.sameRow = function (c2) {
  if (this.isEmpty() || c2.isEmpty()) {
    return false;
  }
  else {
    /*if (this.rowNumber === c2.rowNumber) {
      console.log("same row!");
    }*/
    return this.rowNumber === c2.rowNumber;
  }
}

// Returns the number if any or _
Cell.prototype.getNumber = function () {
  //var ret = this.number || '_';
  //return ret;
  return this.number;
};

// Removes cell making it appear empty
Cell.prototype.remove = function () {
  this.number = 0;
  return this;
};

//module.exports = Cell;