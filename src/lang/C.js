var execSync = require('child_process').execSync,
    path = require('path');
module.exports.initSync = function (files) {
  var res = [], output;
  for (var i = 0, l = files.length; i < l; i++) {
    if (files[i].match(/\.c$/)) {
      output = files[i].split(path.sep).pop().replace('.c', '.bin');
      execSync('cc -o '+output+ " " +files[i]);
      res[res.length] = { title: 'C',
                          exec: "./"+output,
			  args: [] };
    }
  }
  return res;
}
