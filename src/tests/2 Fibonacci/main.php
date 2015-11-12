<?php
error_reporting(E_ALL);
$N = 0;          // input
$T = 0;          // time limit (seconds)
$stopTime = 0;   // time when we should stop
$iterations = 0; // amount of finished cycles of computing

$res = NULL;     // array of current value and previous 3 numbers

if (count($argv) != 2) {
  print("Time limit parameter required:\n php main.php <time>\n");
} else {
  $iterations = 0;
  $T = $argv[1];
  print("Calculating N's Fibonacci number many times during $T seconds\n");
  print("Input N:\n");
  
  fscanf(STDIN, "%d\n", $N);
  start();
}

function start() {
  global $stopTime, $iterations, $N, $T, $res;
  $stopTime = microtime(true) + $T; // NOW + T seconds
  while ( microtime(true) < $stopTime) {
    reinit();
    calc($N);
    $iterations++;
  }
  $iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  print("> $iterations iterations\n");
  print("Resulting F($N) = {$res[($N-1) & 3]}\n");
}

function reinit () {
  global $res;
  if ($res === NULL) {
    $res = array(1, 1, 2, 3);
  } else {
    $res[0] = 1;
    $res[1] = 1;
    $res[2] = 2;
    $res[3] = 3;
  }
}

function calc($N) {
  global $res;
  for ($i = 4; $i < $N; $i++) {
    $res[$i & 3] = $res[($i-1) & 3] + $res[($i-2) & 3];
  }
}
