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
    execlist; // list of commands to execute (and compare results)

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
      process.stdout.write("Running test cases from 'tests/"+testdir+path.sep+"'\n");

      files = fs.readdirSync(testspath + path.sep + testdir);

      process.chdir(testspath + path.sep + testdir);
      loadlangmodulesSync();

      execlist = initlangmodulesSync();

      runtests(execlist);

      process.chdir(cwd);
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
      process.stdout.write("  Module "+langs[i]+" loaded\n");
    }
  }
  process.stdout.write("\n");
}

function initlangmodulesSync() {
  var res = [];
  for (var i = 0, l = langmodules.length; i < l; i++) {
    res = res.concat( langmodules[i].initSync(files) );
  }
  return res;
}

function runtests(execlist) {
  for (var i = 0, l = execlist.length; i < l; i++) {
    var opts = {
          input: input,
          encoding: 'utf-8'
	  };
    var res = execSync(execlist[i].exec + ' '+execlist[i].args.concat([time]).join(' '), opts);
    process.stdout.write(res.replace(/^(?=.)/mg, '['+execlist[i].title+'] ') + "\n");
  }
}
