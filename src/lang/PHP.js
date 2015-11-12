var execSync = require('child_process').execSync,
    path = require('path');
module.exports.initSync = function (files) {
  var res = [], className,
      hasphp = false;
  try {
      execSync('php -v', {stdio:[null, null, null]});
      hasphp = true;
  } catch (e) {};

  if (hasphp) {
    for (var i = 0, l = files.length; i < l; i++) {
      if (files[i].match(/\.php$/)) {
        res[res.length] = { title: 'PHP',
                          exec: 'php',
                          args: [files[i]] };
      }
    }
  }

  return res;
}
