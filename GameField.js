var //Row = require("Row"),
    //Cell = require("Cell"),
    GameField;

GameField = function () {
  this.setUp();
};

GameField.prototype.getCell = function (id) {
  var n;
  n = id.split(':');
  return this.rows[n[0]].cells[n[1]];
};


GameField.prototype.matchCells = function (id1, id2) {
  var c1, c2;
  
  c1 = this.getCell(id1);
  c2 = this.getCell(id2);
  
  if (c1.matches(c2)) {
    console.log("Cells matched");
    if ((c1.sameRow(c2) && this.noCellsBetweenInRow(c1, c2)) || (c1.sameColumn(c2) && this.noCellsBetweenInColumn(c1, c2))) {
      console.log("Cells will be deleted");
      this.matched(c1, c2);
      return true;
    }
  }
  return false;
};

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
  else {
    console.log("addresses equal");
    c1.print();
    c2.print();
    return false;
  }
  
  if (row1+1 === row2) {  // if neighbours
    return true;
  }
  
  else {
    for (i = row1+1; i < row2; i++) {
      if (!this.rows[i].cells[column].isEmpty()) { return false; }
      console.log("Cell empty: ");
      this.rows[i].cells[column].print();
    }
  }
  return true;
};

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
  else {
    console.log("addresses equal");
    c1.print();
    c2.print();
    return false;
  }
  
  if (column1+1 === column2) {
    return true;
  }
  
  else {
    for (i = column1+1; i < column2; i++) {
      if (!this.rows[row].cells[i].isEmpty()) { return false; }
      console.log("Cell empty: ");
      this.rows[row].cells[i].print();
    }
  }
  
  return true;
};

GameField.prototype.matched = function (c1, c2) {
  c1.remove();
  c1.print();
  console.log(c1);
  c2.remove();
  c2.print();
  console.log(c2);
};

GameField.prototype.print = function () {
  var i, j;
  for (i in this.rows) {
    console.log('Row ' + i);
    console.log(this.rows[i]);
    for (j in this.rows[i].cells) {
      this.rows[i].cells[j].print();
    }
  }
};

GameField.prototype.paint = function () {
  $(".gameField").empty();
  for (i in this.rows) {
    r = '<div class = "row">';
    for (j in this.rows[i].cells) {
      r += '<div class = "cell" id="' + i + ':' + j +'">' + this.rows[i].cells[j].getNumber() + '</div>';
    }
    r += '</div>';
    $(".gameField").append(r);
    console.log("GameField repainted");
  }
};

GameField.prototype.setUp = function () {
  var r;
  this.rows = [];
  
  r = new Row([1,2,3,4,5,6,7,8,9,1], 0);
  this.rows.push(r);
  r = new Row([1,1,1,2,1,3,1,4,1,5], 1);
  this.rows.push(r);
  r = new Row([1,6,1,7,1,8,1,9,0,0], 2);
  this.rows.push(r);
}

//module.exports = GameField;