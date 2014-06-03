var g, selectorFn, highScore = 0;

// Main script
//  TODO add hint()

$(window).ready(function () {
  start();
});

// Starts the game
function start () {
  var selected = [];
  
  // Handles selecting & matching the cells
  // TODO   deselect when clicked outside
  // TODO   mb deselect when unmatching cells selected
  // TODO   one day: make cool animation for cells disappearing (one day, one day)
  selectorFn = function() {
    var res, node = $(this);
    
    switch (selected.length) {
      case 0:
        node.addClass('selected');
        selected.push(node.attr('id'));
        console.log("FIRST: " + selected);
        break;
    
    // matches when the second cell is selected
      case 1:
        node.addClass('selected');
        selected.push(node.attr('id'));
        console.log("Second: " + selected);
        res = g.matchCells(selected[0], selected[1]); 
        console.log(res);
        if (res) {
          paint();
        }
        break;
    
      default:
        $('.selected').removeClass('selected');
        node.addClass('selected');
        selected = [node.attr('id')];
        console.log("Emptied: " + selected);
        break;
      } 
    };
  
  g = new GameField();
  
  paint();
  showRules();
};

// Restarts the game
function restart () {
  if (g.getScore() > this.highScore) {
    this.highScore = g.getScore();
  }
  start();
};

// Adds more numbers when no more moves possible
function addMore () {
  g.addMore();
  paint();
};

// Highlights next possible move
function hint () {
  alert("Implement me!");
};

// Shows the rules
function showRules () {
  var r = "<div id='rules'><div id='clearRules' onclick='closeRules()'>X</div><strong>Rules</strong><br><br>This game has no rules.<br>I'm proud to be a part of this number.</div>";
  $('.ruleField').empty();
  $('.ruleField').append(r);
};

// Removes the rules
function closeRules () {
  $('.ruleField').empty();
};

// Adds field contents to the page in a proper manner
function paint () {
  $(".gameField").empty();
  $("#score").empty();
  $("#highScore").empty();
  
  $("#score").append(g.getScore());
  $("#highScore").append(this.highScore);
  
  for (i in g.rows) {
    r = '<div class = "row">';
    for (j in g.rows[i].cells) {
      r += '<div class = "cell" id="' + i + ':' + j +'">' + g.rows[i].cells[j].getNumber() + '</div>';
    }
    r += '</div>';
    $(".gameField").append(r);
  }
  console.log("GameField repainted");
  $('.cell').click(selectorFn);
  g.print();
};