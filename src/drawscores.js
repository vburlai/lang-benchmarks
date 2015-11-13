/*
 * Display chart in console
 */
(function (module) {
var drawrow = function (prefix, score, len) {
    var res = prefix;
    for (var i = prefix.length; i < len; i++) {
      res += (i < score) ? "#" : " ";
    }
    return res;
  },
  drawscores = function (execlist) {
    var cols = 60,
        maxiterations = 0,
	longesttitle = '';
    if (process.stdout.isTTY) {
      cols = Math.floor(process.stdout.columns * 0.8);
    }

    // sort
    execlist.sort(function (a, b) {
      return b.iterations - a.iterations;
    });

    // find maximum iterations count and longest title
    maxiterations = execlist[0].iterations;
    for (var i = 0, l = execlist.length; i < l; i++) {
      if (execlist[i].title.length > longesttitle.length) {
        longesttitle = execlist[i].title;
      }
    }
  
    // space available for chart
    var space = cols - " 1.000 ".length - longesttitle.length;
  
    for (var i = 0, l = execlist.length; i < l; i++) {
      var score = execlist[i].iterations / maxiterations;
      process.stdout.write( drawrow("", space * score, space) );
      process.stdout.write( " " + drawrow((Math.ceil( 1000 * score) / 1000)+"", 0, 5) + " " + execlist[i].title + "\n");
    }
  };

module.exports = drawscores;
}(module));
