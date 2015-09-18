
var S,          // input
    n,          // length of S
    W,          // width of the screen
    T,          // time limit (seconds)
    stopTime,   // time when we should stop
    iterations, // amount of finished cycles of computing

    wc,         // words count
    ws,         // words' positions in S
    wl,         // words' lengths
    line,       // number of words optimal in a line
    res;        // array of minimal free space for each subsequence

if (process.argv.length != 3) {
  process.stdout.write("Time limit parameter required:\n node main.js <time>\n");
} else {
  iterations = 0;
  T = Number.parseInt(process.argv[2], 10);
  process.stdout.write("Calculating unused space F(W, S) for string S and width W many times during "+T+" seconds\n");
  process.stdout.write("Input W: ");
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk != null) {
      if (typeof W === 'undefined') {
        var r = chunk.trim().split("\n");
	W = Number.parseInt(r[0].trim(), 10);
	if (r.length > 1) {
          process.stdout.write("Input S: ");
	  S = r[1].trim();
	  n = S.length;
	}
        if (typeof S === 'undefined') {
          process.stdout.write("Input S: ");
        }
      } else {
        if (typeof S === 'undefined') {
	S = chunk.trim();
	n = S.length;
	}
      }
      if (typeof W !== 'undefined' &&
          typeof S !== 'undefined') {
	process.stdout.write("\n");
	setTimeout(start, 1);
      }
    }
  });
}

function start() {
  stopTime = (new Date()).getTime() + T * 1000; // NOW + T seconds
  while ( (new Date()).getTime() < stopTime) {
    reinit();
    calc();
    iterations++;
  }
  iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  process.stdout.write("> "+iterations+" iterations\n");
  process.stdout.write("Resulting F(W, S) = "+res[0]+"\n");
  outputText();
  process.exit();
}

function reinit () {
  // input parsing done only once, not counted in measurements
  if (typeof res == 'undefined') {
    // count words
    wc = 1;
    for (var i = 0; i < n; i++) {
      if (S.charAt(i) == ' ') {
        wc++;
      }
    }

    // split by words
    // creating ws and wl of size wc+1
    ws = [];
    wl = [];
    var j = 0;
    ws[j] = 0;
    for (var i = 0; i < n; i++) {
      if (S.charAt(i) == ' ') {
        wl[j] = i - ws[j];
	j++;
	ws[j] = i + 1;
      }
    }
    wl[j] = n - ws[j];
    // EOF marker
    wl[wc] = 0;
    ws[wc] = n + 1;

    // res is of size wc+2
    res = [];
    res[wc + 1] = 0;
    // line is of size wc+1
    line = [];
  }
  // no cleanup needed
}

function calc() {
  // no content, no unused space
  res[wc] = 0;
  line[wc] = 0;

  for (var i = wc - 1; i >= 0; i--) {
     // start with a single word
     line[i] = 1;
     // space occupied by words
     var sp = wl[i];
     res[i] = W - sp + res[i + line[i]];

     var newln = line[i];
     var newrs = res[i];

     // try to add one more word
     while (sp <= W &&
            i + newln <= wc) {
       if (newrs <= res[i]) {
         line[i] = newln;
         res[i] = newrs;
       }
       
       sp += 1 + wl[i + newln];
       newln++;
       newrs = W - sp + res[i + newln];
     }
  }
}

function outputText() {
  process.stdout.write('\n');
  var pos = 0;
  while (line[pos] != 0) {
    outputLineWithPadding(S.substring(ws[pos], ws[pos + line[pos]] - 1));
    pos += line[pos];
  }
}

function outputLineWithPadding(s) {
  process.stdout.write(' ' + s);
  for (var i = s.length; i < W; i++) {
    process.stdout.write('_');
  }
  process.stdout.write('\n');
}
