
var N,          // input
    T,          // time limit (seconds)
    stopTime,   // time when we should stop
    iterations, // amount of finished cycles of computing

    res;        // array of current value and previous 3 numbers

if (process.argv.length != 3) {
  process.stdout.write("Time limit parameter required:\n node main.js <time>\n");
} else {
  iterations = 0;
  T = Number.parseInt(process.argv[2], 10);
  process.stdout.write("Calculating N's Fibonacci number many times during "+T+" seconds\n");
  process.stdout.write("Input N:\n");
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk != null) {
      if (typeof N === 'undefined') {
        N = Number.parseInt( chunk.replace("\n", ""), 10);
	setTimeout(start, 1);
      }
    }
  });
}

function start() {
  stopTime = (new Date()).getTime() + T * 1000; // NOW + T seconds
  while ( (new Date()).getTime() < stopTime) {
    reinit();
    calc(N);
    iterations++;
  }
  iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  process.stdout.write("> "+iterations+" iterations\n");
  process.stdout.write("Resulting F("+N+") = "+res[(N-1) & 3]+"\n");
  process.exit();
}

function reinit () {
  if (typeof res == 'undefined') {
    res = [1, 1, 2, 3]; 
  } else {
    res[0] = 1;
    res[1] = 1;
    res[2] = 2;
    res[3] = 3;
  }
}

function calc(N) {
  for (var i = 4; i < N; i++) {
    res[i & 3] =  res[(i-1) & 3] + res[(i-2) & 3];
  }
}
