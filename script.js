$(window).ready(function () {
  var selected = [],
      selectorFn,
      g = new GameField();
  
  g.paint();
  
  selectorFn = function() {
    var res, node = $(this);
    
    if (selected.length === 0) {
      node.addClass('selected');
      selected.push(node.attr('id'));
      console.log("FIRST: " + selected);
    }
    
    else if (selected.length === 1) {
      node.addClass('selected');
      selected.push(node.attr('id'));
      console.log("Second: " + selected);
      res = g.matchCells(selected[0], selected[1]); 
      console.log(res);
      if (res) {
        g.paint();
        $('.cell').click(selectorFn);
      }
    }
        
    else {
      $('.selected').removeClass('selected');
      node.addClass('selected');
      selected = [node.attr('id')];
      console.log("Emptied: " + selected);
      }
    };
  
  $('.cell').click(selectorFn);
});