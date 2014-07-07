var g, selectorFn, deselectorFn, startTime, highScore,
    topPadding = $('.header').height() + $('.ruleField').height();

// Main script
//  TODO  keyboard controls!
//  TODO  handle winning --> when field is cleared, something must happen
//  TODO  paint() should be in its own handler i guess
//  NOTE  score doesn't really make sense
//  NOTE  when new game started, scroll position must be reset
//  TODO  browser compatibility --> e.g. Safari doesn't support flex or what?

$(window).ready(function () {
  
  if(typeof(Storage) !== "undefined") {
    highScore = localStorage.getItem("highScore") || 0;
  }
  
  start();
});

// Animates sticky sidebar when page scrolled
//    beware that it is still fixed positioning & may end up with sidebar being unreachable
$(function() {
  var sidebar = $(".sidebar"),  
      windowObject = $(window),
      offset = sidebar.offset();

  windowObject.scroll(function() {
    if (windowObject.scrollTop() > offset.top) {
        sidebar.stop().animate({
        marginTop: windowObject.scrollTop() - offset.top + topPadding + 200
      }, 100);
    }
    else {
      sidebar.stop().animate({ marginTop: 0 }, 100);
    }
  });
});

// Starts the game
function start () {
  var selectedCell = false,
      deselect = function (node) {
        node.removeClass('selected');
        selectedCell = false; 
      };

  // Handles selecting & matching the cells
  // TODO   keep in mind that "_" will not stand for empty cells forever, modify switch accordingly
  selectorFn = function(event) {
    var node = $(event.target);

    // Deselects if a selected cell is clicked
    if (node.is('.selected')) { deselect(node); }
    
    else {
      if (node.text() !== "_") {      // we only select non-empty cells
        if (!selectedCell) {
          node.addClass('selected');
          selectedCell = node.attr('id');
        }
        // matches when the second cell is selected
        else {
          g.matchCells(selectedCell, node.attr('id')); 
          deselect(node);
          paint();
        }
      } 
    }
  };
  
  deselectorFn = function(event) {
    if (!$(event.target).is('.cell')) { deselect($('.selected')); }
  };
  
  g = new GameField();

  $(window).scrollTop(0);
  paint();
  showRules();
};

// Restarts the game
function restart () {
  if (g.getScore() > this.highScore) {
    this.highScore = g.getScore();
    localStorage.setItem("highScore", this.highScore);
  }
  startTime = new Date();
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

// Shows the rules
function showRules () {
  var r = "<div id='rules'><div id='clearRules' onclick='closeRules()'>X</div>Delete a pair of numbers if: <ol><li>they are equal or sum up to 10,</li><li>they are in the same row or column, and</li><li>there is no other number between them</li></ol></div>";
  $('#ruleField').empty();
  $('#ruleField').append(r);
};

// Removes the rules
function closeRules () {
  $('#ruleField').empty();
};

// Gets the timer
function playingTime() {
  var today, t, time, ms;
  
  if (!startTime) { startTime = new Date() };   // get start time
  
  today = new Date();
  
  ms = today.getTime() - startTime.getTime();
  time = msToTime(ms);
  
  // $("#timer").empty();
  // $("#timer").append(time);
  
  t = setTimeout(function(){ playingTime() }, 500);
}

// Converts milliseconds to time
function msToTime (t) {
  var ms, s, m, h;
  
  function addZ (n) {
    return (n<10? '0':'') + n;
  }

  ms = t % 1000;
  t = (t - ms) / 1000;
  s = t % 60;
  t = (t - s) / 60;
  m = t % 60;
  h = (t - m) / 60;

  return addZ(h) + ':' + addZ(m) + ':' + addZ(s);
}

// Adds field contents to the page in a proper manner
function paint () {
  $("#gameField").empty();
  $("#score").empty();
  $("#highScore").empty();
  /*$("#rowCount").empty();
  $("#cellCount").empty();*/
  
  $("#score").append(g.getScore());
  $("#highScore").append(this.highScore);
  /*$("#rowCount").append(g.getRowCount());
  $("#rowCount").append(" rows");
  $("#cellCount").append(g.getCellCount());
  $("#cellCount").append(" cells");*/
  
  for (i in g.rows) {
    r = '<div class = "row">';
    for (j in g.rows[i].cells) {
      r += '<div class = "cell" id="' + i + ':' + j +'">' + g.rows[i].cells[j].getNumber() + '</div>';
    }
    r += '</div>';
    $("#gameField").append(r);
  }
  //console.log("GameField repainted");
  
  $('.cell').click(selectorFn);
  $(document).click(deselectorFn);
  //g.print();
};