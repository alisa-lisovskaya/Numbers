var g, selectorFn, deselectorFn, startTime, highScore,
    keys = [],
    topPadding = $('.header').height() + $('.ruleField').height();

// Main script
//  TODO  paint() should be in its own handler i guess
//  NOTE  when new game started, scroll position must be reset
//  TODO  Safari doesn't support flex or what?

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

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
      if (node.text() !== '') {      // we only select non-empty cells
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
 
// Handles the pressed keys
function keysPressed (k) {
  keys[k.keyCode] = true;
     
  // Ctrl + R
  if (keys[17] && keys[82]) {
    restart();
    k.preventDefault();
  }
     
  // Ctrl + Z
  if (keys[17] && keys[90]) {
    cancel();
    k.preventDefault();
  }
};

// Handles releasing the keys
function keysReleased (k) {
    keys[k.keyCode] = false;
};

// Adds more numbers when no more moves possible
function addMore () {
  if (!g.isWon()) {
    g.addMore();
    paint();
  }
};

// Cancels the last move
// TODO   can alert when no more moves left to restore: http://api.jqueryui.com/dialog/
// TODO   can use the same library for rules maybe
function cancel () {
  if (!g.isWon()) {
    g.restore();
    paint();
  }
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
  var number;

  $("#gameField").empty();

  if (!g.isWon()) {

    // Shouldn't this be private?
    for (i in g.rows) {
      r = '<div class = "row">';
      for (j in g.rows[i].cells) {
        number = g.rows[i].cells[j].getNumber()
        console.log(number);
        g.rows[i].cells[j].print();
        r += '<div class = "cell" id="' + i + ':' + j +'">' + (number === 0 ? '' : number) + '</div>';
      }
      r += '</div>';
      $("#gameField").append(r);
    }
  
    $('.cell').click(selectorFn);
    $(document).click(deselectorFn);
  }

  else {
    $("#gameField").append("You are the champion, my friend!");
  }
};