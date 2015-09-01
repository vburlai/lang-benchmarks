var name, // name or number of the test (to match against directory name)
    time, // time per test (seconds), passed to process
    testdir, // directory of match test case
    path = require("path"),
    fs = require("fs"),
    execSync = require("child_process").execSync,
    cwd = process.cwd(),
    INPUTFILENAME = "INPUT.TXT", // input file name with input data for tests
    input, // input data for test case
    testspath = path.dirname(__filename)+path.sep+"tests", // path to 'tests/' dir
    files, // list of files in test case 'tests/<test case name>/'
    langspath = path.dirname(__filename)+path.sep+"lang", // path to 'lang/' dir
    langmodules, // lang modules loaded
    execlist, // list of commands to execute (and their results)
    maxiterations, // max number of iterations - best result
    longesttitle; // longest language title

if (process.argv.length !== 4) {
  process.stdout.write("Test name or number and time per test required:\n node run_test.js <test number/name> <time per test>\n");
} else {
  name = process.argv[2];
  time = process.argv[3];

  testdir = findtestdir(name);

  if (typeof testdir === 'undefined') {
    process.stdout.write("Test name '"+name+"' not found in tests/ directory\n");
  } else {
    input = fs.readFileSync(testspath + path.sep + testdir + path.sep + INPUTFILENAME, 'utf-8');
    if (input.length > 0 ) {
      process.stdout.write("Running test cases from 'tests/"+testdir+"/'");

      files = fs.readdirSync(testspath + path.sep + testdir);

      process.chdir(testspath + path.sep + testdir);
      loadlangmodulesSync();

      execlist = initlangmodulesSync();

      process.stdout.write(" for " + (execlist.length * parseInt(time, 10)) + " seconds\n");

      runtests(execlist);

      process.chdir(cwd);

      outputresults(execlist);

      drawscores(execlist, maxiterations, longesttitle);
    }
  }
}

function findtestdir(name) {
  var fls = fs.readdirSync(testspath);
  for(var i = 0, l = fls.length; i < l; i++) {
    if (fls[i].indexOf(name) !== -1) {
      return fls[i];
    }
  }
  return;
}

function loadlangmodulesSync() {
  var langs = fs.readdirSync(langspath);
  langmodules = [];
  for (var i = 0, l = langs.length; i < l; i++) {
    if (langs[i].match(/\.js$/)) {
      langmodules[langmodules.length] = require(langspath+path.sep+langs[i]);
    }
  }
}

function initlangmodulesSync() {
  var res = [];
  for (var i = 0, l = langmodules.length; i < l; i++) {
    res = res.concat( langmodules[i].initSync(files) );
  }
  return res;
}

function runtests(execlist) {
  maxiterations = 0;
  for (var i = 0, l = execlist.length; i < l; i++) {
    var opts = {
          input: input,
          encoding: 'utf-8'
	  };
    execlist[i].output = execSync(execlist[i].exec + ' '+execlist[i].args.concat([time]).join(' '), opts);
    execlist[i].iterations = 0;
    var m;
    if (m = execlist[i].output.match(/> ([0-9]+)/m)) {
      execlist[i].iterations = parseInt(m[1], 10);
      if (execlist[i].iterations > maxiterations) {
        maxiterations = execlist[i].iterations;
      }
    }
    if (typeof longesttitle == 'undefined' || longesttitle.length < execlist[i].title.length) {
      longesttitle = execlist[i].title;
    }
  }
}

function outputresults(execlist) {
  for (var i = 0, l = execlist.length; i < l; i++) {
    process.stdout.write("[" + execlist[i].title + "]\n");
    process.stdout.write(execlist[i].output.replace(/^/mg,"  ") + "\n");
  }
}

function drawscores(execlist, maxiterations, longesttitle) {
  var cols = 60;
  if (process.stdout.isTTY) {
    cols = Math.floor(process.stdout.columns * 0.8);
  }

  // space available for chart
  var space = cols - " 1.000 ".length - longesttitle.length;

  for (var i = 0, l = execlist.length; i < l; i++) {
    var score = execlist[i].iterations / maxiterations;
    process.stdout.write( drawrow("", space * score, space) );
    process.stdout.write( " " + drawrow((Math.ceil( 1000 * score) / 1000)+"", 0, 5) + " " + execlist[i].title + "\n");
  }
}

function drawrow(prefix, score, len) {
  var res = prefix;
  for (var i = prefix.length; i < len; i++) {
    res += (i < score) ? "#" : " ";
  }
  return res;
}
