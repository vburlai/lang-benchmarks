
var N,          // input
    T,          // time limit (seconds)
    stopTime,   // time when we should stop
    iterations, // amount of finished cycles of computing

    res;        // current value

if (process.argv.length != 3) {
  process.stdout.write("Time limit parameter required:\n node main.js <time>\n");
} else {
  iterations = 0;
  T = Number.parseInt(process.argv[2], 10);
  process.stdout.write("Calculating factorial of N many times during "+T+" seconds\n");
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
  process.stdout.write("Resulting "+N+"! = "+res+"\n");
  process.exit();
}

function reinit () {
  res = 1;
}

function calc(N) {
  for (var i = N; i > 1; i--) {
    res *= i;
  }
}
