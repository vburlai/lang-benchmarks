
var X,          // input
    Y,          // input
    T,          // time limit (seconds)
    stopTime,   // time when we should stop
    iterations, // amount of finished cycles of computing

    res;        // array of subsquences' max lengths

if (process.argv.length != 3) {
  process.stdout.write("Time limit parameter required:\n node main.js <time>\n");
} else {
  iterations = 0;
  T = Number.parseInt(process.argv[2], 10);
  process.stdout.write("Calculating LCS of two strings X and Y many times during "+T+" seconds\n");
  process.stdout.write("Input X: ");
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk != null) {
      if (typeof X === 'undefined') {
        var r = chunk.trim().split("\n");
	X = r[0].trim();
	if (r.length > 0) {
	  Y = r[1].trim();
	}
        if (typeof Y === 'undefined') {
          process.stdout.write(X+"\nInput Y: ");
        }
      } else {
        if (typeof Y === 'undefined') {
	Y = chunk.trim();
	}
      }
      if (typeof X !== 'undefined' &&
          typeof Y !== 'undefined') {
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
  process.stdout.write("Resulting LCS(X, Y) = "+res[X.length][Y.length]+"\n");
  outputLCS();
  process.exit();
}

function reinit () {
  if (typeof res == 'undefined') {
    // create 2-dimensional array
    res = [[]];
    for (var i = 1, l=X.length; i <= l; i++) {
      res [i] = [];
    }
  }
  // no cleanup needed
}

function calc() {
  for (var i = 0, l=X.length; i <= l; i++) {
    res [i][0] = 0;
  }
  for (var i = 0, l=Y.length; i <= l; i++) {
    res [0][i] = 0;
  }
  for (var i = 1, l=X.length; i <= l; i++) {
    for (var j = 1, k=Y.length; j <= k; j++) {
      if (X.charCodeAt(i-1) == Y.charCodeAt(j-1)) {
        res [i][j] = 1 + res [i-1][j-1];
      } else {
        res [i][j] = Math.max( res [i-1][j], res [i][j-1] );
      }
    }
  }
}
function outputLCS() {
  var i = X.length, j = Y.length;
  var substrX = X.replace(/./g,'_').split("");
  var substrY = Y.replace(/./g,'_').split("");

  while ( i > 0 && j > 0) {
    if (X.charCodeAt(i-1) == Y.charCodeAt(j-1)) {
      i--; j--;
      substrX[i] = X.charAt(i);
      substrY[j] = Y.charAt(j);
    } else {
      if ( res[i - 1][j] > res [i][j-1] ) {
        i--;
      } else {
        j--;
      }
    }
  }

  process.stdout.write("\n" + X + "   " + Y + "\n");
  process.stdout.write(substrX.join("") + " = " + substrY.join("") + "\n");
}
