// Main script
//  TODO add restart(), hint() and addMore()

$(window).ready(function () {
  var selected = [],
      selectorFn,
      g = new GameField();
  
  g.paint();
  
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
});

function restart () {
  alert("Implement me!");
};

function addMore () {
  alert("Implement me!");
};

function hint () {
  alert("Implement me!");
};