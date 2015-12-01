var time, // time per test (seconds), passed to process
    CMD = 'run_test.js --json',
    DIVIDER = 1000.0,
    path = require("path"),
    fs = require("fs"),
    execSync = require("child_process").execSync,
    testspath = path.dirname(__filename)+path.sep+"tests", // path to 'tests/' dir
    files, // list of tests
    results = [], // accumulated results
    mapping = {}, // 'title' -> index in results
    drawscores = require('./drawscores.js'); // module for writing output

if (process.argv.length !== 3) {
  process.stdout.write("Time per test required:\n node run_all.js <time per test>\n");
} else {
  time = process.argv[2];

  process.stdout.write("Running all test cases from 'tests/' directory\n");

  files = fs.readdirSync(testspath);
  for(var i = 0, l = files.length; i < l; i++) {
    if (fs.statSync(testspath + path.sep + files[i]).isDirectory()) {
      var opts = { encoding: 'utf-8' },
          out = execSync(process.argv[0] + ' ' + path.dirname(__filename) + path.sep + CMD + ' "' + '" ' + time, opts),
          outjson = JSON.parse(out);
              
      for (var j = 0, k = outjson.length; j < k; j++) {
        var title = outjson[j].title,
            iterations = outjson[j].iterations / DIVIDER,
            missing = outjson[j].missing;
        //console.log(files[i] + ' ' + title +' '+iterations);
        if (typeof mapping[title] !== 'undefined') {
          results[mapping[title]].iterations += iterations;
        } else {
          mapping[title] = results.length;
          results[mapping[title]] = { title: title, iterations: iterations, missing: missing };
        }
      }

      process.stdout.write(" " + files[i] + " [v]\n");
    }
  }

  process.stdout.write("\nOverall summary (from fastest to slowest):\n");
  drawscores(results);
  //console.log(results);
}
