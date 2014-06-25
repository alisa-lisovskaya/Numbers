var g, selectorFn, deselectorFn, startTime, highScore = 0;

// Main script
//  TODO  cool header with the title :)
//  TODO  make numbers out of pictures
//  TODO  add hint()
//  TODO  add severity levels
//  TODO  handle winning --> when field is cleared; time must stop
//  TODO  paint() should be in its own handler i guess
//  TODO  pause() --> field should be blended
//  TODO  score() <--- make score awesumer, with blinking flashing lights, music, and confetti
//  TODO  harder level with only n + m = 10
//  TODO  every n minutes, pause should be forced

$(window).ready(function () {
  start();
});

// Animates sticky sidebar when page scrolled
//    beware that it is still fixed positioning & may end up with sidebar being unreachable
//    if the height of the screen is smaller than the height of the sidebar
$(function() {
  var $sidebar    = $(".sidebar"),  
      $window     = $(window),
      offsetSB    = $sidebar.offset(),
      topPadding  = 85;

  $window.scroll(function() {
    if ($window.scrollTop() > offsetSB.top) {
        $sidebar.stop().animate({
        marginTop: $window.scrollTop() - offsetSB.top + topPadding
      });
    }
    else {
      $sidebar.stop().animate({ marginTop: 0 });
    }
  });
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
          //console.log("FIRST: " + selected);
        }
        break;
    
    // matches when the second cell is selected
      case 1:
        if (node.text() !== "_") {
          node.addClass('selected');
          selected.push(node.attr('id'));
          //console.log("Second: " + selected);
          res = g.matchCells(selected[0], selected[1]); 
          if (res) {
            // deselect all
            $('.selected').removeClass('selected');
            selected = [];
            //console.log("deselected");
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
          
          //console.log("Another Second: " + selected);
          g.matchCells(selected[0], selected[1]); 
          
          // deselect all
          $('.selected').removeClass('selected');
          selected = [];
          //console.log("deselected");
          paint();
        }
        break;
      } 
    };
  
  deselectorFn = function() {
    if(!$(event.target).is('.cell'))
    {
      $('.selected').removeClass('selected');
      selected = [];  // everything's deselected so the array must be emptied
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
  $(".gameField").empty();
  $("#score").empty();
  $("#highScore").empty();
  $("#rowCount").empty();
  $("#cellCount").empty();
  
  $("#score").append(g.getScore());
  $("#highScore").append(this.highScore);
  $("#rowCount").append(g.getRowCount());
  $("#rowCount").append(" rows");
  $("#cellCount").append(g.getCellCount());
  $("#cellCount").append(" cells");
  
  for (i in g.rows) {
    r = '<div class = "row">';
    for (j in g.rows[i].cells) {
      r += '<div class = "cell" id="' + i + ':' + j +'">' + g.rows[i].cells[j].getNumber() + '</div>';
    }
    r += '</div>';
    $(".gameField").append(r);
  }
  //console.log("GameField repainted");
  
  $('.cell').click(selectorFn);
  $(document).click(deselectorFn);
  //g.print();
};