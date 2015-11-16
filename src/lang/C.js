var execSync = require('child_process').execSync,
    renameSync = require('fs').renameSync,
    path = require('path');

module.exports.initSync = function (files) {
  var res = [], output,
      hascc = false, hasemcc = false;

  try {
      execSync('cc -v', {stdio:[null, null, null]});
      hascc = true;
  } catch (e) {};
  try {
      execSync('emcc -v', {stdio:[null, null, null]});
      hasemcc = true;
  } catch (e) {};

  if (hasemcc || hascc) {
    for (var i = 0, l = files.length; i < l; i++) {
      if (files[i].match(/\.c$/)) {
        if (hascc) {
          output = files[i].split(path.sep).pop().replace('.c', '.bin');
          execSync('cc -o ' + output + " " + files[i], {stdio:[null, null, null]});

          res[res.length] = { title: 'C',
                              exec: "./"+output,
                              args: [] };
        } else {
	  res[res.length] = { title: 'C', missing: "'cc' not found" };
	}

        if (hasemcc) {
          output = files[i].split(path.sep).pop().replace('.c', '.emccjs');
          execSync('emcc -o ' + output + ".js " + files[i], {stdio: [null, null, null]});
          renameSync(output + '.js', output);

          res[res.length] = { title: 'Emscripten',
                              exec: "node "+output,
                              args: [] };
        } else {
	  res[res.length] = { title: 'Emscripten', missing: "'emcc' not found" };
	}
      }
    }
  }

  return res;
}
