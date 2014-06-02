var g;

// Main script
//  TODO add hint() and addMore()

$(window).ready(function () {
  start();
});

// (Re)starts the game
function start () {
  var selectorFn,
      selected = [];
  
  g = new GameField();
  g.paint();
  showRules();
  
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
          g.paint();
          $('.cell').click(selectorFn);
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
  
  $('.cell').click(selectorFn);
};

// Adds more numbers when no more moves possible
function addMore () {
  g.addMore();
};

// Highlights next possible move
function hint () {
  alert("Implement me!");
};

// Shows the rules
function showRules () {
  var r = "<div id='rules'><div id='clearRules' onclick='closeRules()'>X</div><strong>Rules</strong><br>This game has no rules. I'm proud to be a part of this number.</div>";
  $('.ruleField').empty();
  $('.ruleField').append(r);
};

// Removes the rules
function closeRules () {
  $('.ruleField').empty();
};