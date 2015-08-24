var execSync = require('child_process').execSync,
    path = require('path');
module.exports.initSync = function (files) {
  var res = [];
  for (var i = 0, l = files.length; i < l; i++) {
    if (files[i].match(/\.java$/)) {
      execSync('javac '+files[i]);
      className = files[i].split(path.sep).pop().replace('.java', '');
      res[res.length] = { title: 'Java',
                          exec: 'java',
			  args: [className] };
    }
  }
  return res;
}
