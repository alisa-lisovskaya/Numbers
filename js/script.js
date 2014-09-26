var g, selectorFn, deselectorFn,
    WINNER = "You are the champion, my friend!",
    keys = [],
    topPadding = $('.header').height() + $('.ruleField').height();

// Main script
//  TODO  paint() should be in its own handler i guess
//  NOTE  when new game started, scroll position must be reset
//  TODO  Safari doesn't support flex or what?

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

$(window).ready(function () {
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
};
 
// Handles the pressed keys
function keysPressed (k) {
  keys[k.keyCode] = true;
     
  // R
  if (keys[82]) {
    start();
  }
     
  // C
  if (keys[67]) {
    cancel();
  }

  // A
  if (keys[65]) {
    addMore();
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

// Adds field contents to the page in a proper manner
function paint () {
  var number;

  $("#gameField").empty();

  if (!g.isWon()) {

    // Shouldn't this be private?
    for (i in g.rows) {
      r = '<div class = "row">';
      for (j in g.rows[i].cells) {
        number = g.rows[i].cells[j].number;
        console.log(number);
        g.rows[i].cells[j].print();
        r += '<div class = "cell" id="' + i + ':' + j +'">' + (number === 0 ? '<div class="removed"></div>' : number) + '</div>';
      }
      r += '</div>';
      $("#gameField").append(r);
    }
  
    $('.cell').click(selectorFn);
    $(document).click(deselectorFn);
  }

  else {
    $("#gameField").append(WINNER);
  }
};