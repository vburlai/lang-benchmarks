<?php
error_reporting(E_ALL);
$N = 0;          // input
$T = 0;          // time limit (seconds)
$stopTime = 0;   // time when we should stop
$iterations = 0; // amount of finished cycles of computing

$res = 0;        // current value

if (count($argv) != 2) {
  print("Time limit parameter required:\n php main.php <time>\n");
} else {
  $iterations = 0;
  $T = $argv[1];
  print("Calculating factorial of N many times during $T seconds\n");
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
  print("Resulting $N! = $res\n");
}

function reinit () {
  global $res;
  $res = 1;
}

function calc($N) {
  global $res;
  for ($i = $N; $i > 1; $i--) {
    $res *= $i;
  }
}
