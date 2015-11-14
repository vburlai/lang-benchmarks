var execSync = require('child_process').execSync,
    path = require('path');
module.exports.initSync = function (files) {
  var res = [], className,
      hasjavac = false;
  try {
      execSync('javac -version', {stdio:[null, null, null]});
      hasjavac = true;
  } catch (e) {};

  if (hasjavac) {
    for (var i = 0, l = files.length; i < l; i++) {
      if (files[i].match(/\.java$/)) {
        execSync('javac '+files[i]);
        className = files[i].split(path.sep).pop().replace('.java', '');
        res[res.length] = { title: 'Java',
                          exec: 'java',
                          args: [className] };
      }
    }
  } else {
    res[res.length] = { title: 'Java', missing: "'javac' not found" };
  }

  return res;
}
