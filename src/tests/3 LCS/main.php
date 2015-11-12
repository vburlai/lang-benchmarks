<?php
error_reporting(E_ALL);
$X = "";         // input
$n = 0;          // length of X
$Y = "";         // input
$m = 0;          // length of Y
$T = 0;          // time limit (seconds)
$stopTime = 0;   // time when we should stop
$iterations = 0; // amount of finished cycles of computing

$res = NULL;     // array of subsquences' max lengths

if (count($argv) != 2) {
  print("Time limit parameter required:\n php main.php <time>\n");
} else {
  $iterations = 0;
  $T = $argv[1];
  print("Calculating LCS of two strings X and Y many times during $T seconds\n");
  print("Input X:\n");
  
  $X = trim(fgets(STDIN, 2047));
  $n = strlen($X);
  print("Input Y:\n");

  $Y = trim(fgets(STDIN, 2047));
  $m = strlen($Y);
  start();
}

function start() {
  global $stopTime, $iterations, $T, $res, $n, $m;
  $stopTime = microtime(true) + $T; // NOW + T seconds
  while ( microtime(true) < $stopTime) {
    reinit();
    calc();
    $iterations++;
  }
  $iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  print("> $iterations iterations\n");
  print("Resulting LCS(X, Y) = {$res[$n][$m]}\n");
  outputLCS();
}

function reinit () {
  global $res, $n, $m;
  if ($res === NULL) {
    // create 2-dimensional array (n+1) x (m+1)
    $res = array(array());
    for ($i = 1; $i <= $n; $i++) {
      $res[$i] = array($m=>0);
    }
  }
  // no cleanup needed
}

function calc() {
  global $res, $n, $m, $X, $Y;
  for ($i = 0; $i <= $n; $i++) {
    $res[$i][0] = 0;
  }
  for ($i = 0; $i <= $m; $i++) {
    $res[0][$i] = 0;
  }
  for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $m; $j++) {
      if ($X[$i - 1] === $Y[$j - 1]) {
        $res[$i][$j] = 1 + $res[$i-1][$j-1];
      } else {
        $res[$i][$j] = max($res[$i-1][$j], $res[$i][$j-1]);
      }
    }
  }
}

function outputLCS() {
  global $n, $m, $res, $X, $Y;
  $i = $n;
  $j = $m;
  $substrX = preg_replace("/./", "_", $X);
  $substrY = preg_replace("/./", "_", $Y);

  while ( $i > 0 && $j > 0) {
    if ($X[$i-1] === $Y[$j-1]) {
      $i--;
      $j--;
      $substrX[$i] = $X[$i];
      $substrY[$j] = $Y[$j];
    } else {
      if ($res[$i-1][$j] > $res[$i][$j-1]) {
        $i--;
      } else {
        $j--;
      }
    }
  }

  print("\n$X   $Y\n");
  print("$substrX = $substrY\n");
}
