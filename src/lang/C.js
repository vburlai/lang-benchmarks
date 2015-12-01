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
          output = files[i].split(path.sep).pop().replace('.c', '.binO0');
          execSync('cc -O0 -o ' + output + " " + files[i], {stdio:[null, null, null]});

          res[res.length] = { title: 'C (non-opt)',
                              exec: "./"+output,
                              args: [] };

          output = files[i].split(path.sep).pop().replace('.c', '.binO2');
          execSync('cc -O2 -o ' + output + " " + files[i], {stdio:[null, null, null]});

          res[res.length] = { title: 'C',
                              exec: "./"+output,
                              args: [] };
        } else {
          res[res.length] = { title: 'C', missing: "'cc' not found" };
        }

        if (hasemcc) {
          output = files[i].split(path.sep).pop().replace('.c', '.emccjsO0');
          execSync('emcc -O0 -o ' + output + ".js " + files[i], {stdio: [null, null, null]});
          renameSync(output + '.js', output);

          res[res.length] = { title: 'Emscripten (non-opt)',
                              exec: "node "+output,
                              args: [] };

          output = files[i].split(path.sep).pop().replace('.c', '.emccjsO2');
          execSync('emcc -O2 -o ' + output + ".js " + files[i], {stdio: [null, null, null]});
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
