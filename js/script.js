var g, selectorFn, deselectorFn, highScore = 0;

// Main script
//  TODO  cool header with the title :)
//  TODO  make numbers out of pictures
//  TODO  add hint()
//  TODO  add severity levels
//  TODO  add timePlayed() : http://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock

$(window).ready(function () {
  start();
});

// Starts the game
function start () {
  var selected = [];
  
  // Handles selecting & matching the cells
  // TODO   mb deselect when unmatching cells selected (then default case is not needed)
  // TODO   one day: make cool animation for cells disappearing (one day, one day)
  // TODO   keep in mind that "_" will not stand for empty cells forever, modify switch accordingly
  selectorFn = function() {
    var res, node = $(this);
    
    switch (selected.length) {
      case 0:
        if (node.text() !== "_") {      // we only select non-empty cells
          node.addClass('selected');
          selected.push(node.attr('id'));
          console.log("FIRST: " + selected);
        }
        break;
    
    // matches when the second cell is selected
      case 1:
        if (node.text() !== "_") {
          node.addClass('selected');
          selected.push(node.attr('id'));
          console.log("Second: " + selected);
          res = g.matchCells(selected[0], selected[1]); 
          if (res) {
            // deselect all
            $('.selected').removeClass('selected');
            selected = [];
            console.log("deselected");
            paint();
          }
        }
        break;
    
      default:
        if (node.text() !== "_") {
          // deselect first selected element
          $("#"+selected[0]).removeClass('selected');
          selected.splice(0,1);
          
          // add new element
          node.addClass('selected');
          selected.push(node.attr('id'));
          
          console.log("Another Second: " + selected);
          g.matchCells(selected[0], selected[1]); 
          
          // deselect all
          $('.selected').removeClass('selected');
          selected = [];
          console.log("deselected");
          paint();
        }
        break;
      } 
    };
  
  deselectorFn = function() {
    if(!$(event.target).is('.cell'))
    {
      $('.selected').removeClass('selected');
    }
  };
  
  g = new GameField();
  
  paint();
  showRules();  // TODO   rules should not reappear on restart if they were closed
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

// Cancels the last move
// TODO   can alert when no more moves left to restore: http://api.jqueryui.com/dialog/
// TODO   can use the same library for rules maybe
function cancel () {
  g.restore();
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
  $(document).click(deselectorFn);
  //g.print();
};