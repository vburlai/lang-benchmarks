<?php
error_reporting(E_ALL);
$S = "";         // input
$n = 0;          // length of S
$W = 0;          // width of the screen
$T = 0;          // time limit (seconds)
$stopTime = 0;   // time when we should stop
$iterations = 0; // amount of finished cycles of computing

$wc = 0;         // words count
$ws = NULL;      // words' positions in S
$wl = NULL;      // words' lengths
$line = NULL;    // number of words optimal in a line
$res = NULL;     // array of minimal free space for each subsequence

if (count($argv) != 2) {
  print("Time limit parameter required:\n php main.php <time>\n");
} else {
  $iterations = 0;
  $T = $argv[1];
  print("Calculating unused space F(W, S) for string S and width W many times during $T seconds\n");
  print("Input W:\n");
  
  fscanf(STDIN, "%d\n", $W);
  print("Input S:\n");

  $S = trim(fgets(STDIN, 2047));
  $n = strlen($S);
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
  print("Resulting F(W, S) = {$res[0]}\n");
  outputText();
}

function reinit () {
  global $res, $wc, $wl, $ws, $S, $n, $line;
  // input parsing done only once, not counted in measurements
  if ($res === NULL) {
    // count words
    $wc = 1;
    for ($i = 0; $i < $n; $i++) {
      if ($S[$i] === " ") {
        $wc++;
      }
    }

    // split by words
    // creating ws and wl of size wc+1
    $ws = array();
    $wl = array();
    $j = 0;
    $ws[$j] = 0;
    for ($i = 0; $i < $n; $i++) {
      if ($S[$i] === " ") {
        $wl[$j] = $i - $ws[$j];
	$j++;
	$ws[$j] = $i + 1;
      }
    }
    $wl[$j] = $n - $ws[$j];
    // EOF marker
    $wl[$wc] = 0;
    $ws[$wc] = $n + 1;

    // res is of size wc+2
    $res = array_fill(0, $wc + 2, 0);
    // line is of size wc+1
    $line = array_fill(0, $wc + 1, 0);
  }
  // no cleanup needed
}

function calc() {
  global $res, $wc, $wl, $line, $n, $W;
  // no content, no unused space
  $res[$wc] = 0;
  $line[$wc] = 0;

  for ($i = $wc - 1; $i >= 0; $i--) {
    // start with a single word
    $line[$i] = 1;
    // space occupied by words
    $sp = $wl[$i];
    $res[$i] = $W - $sp + $res[$i + $line[$i]];

    $newln = $line[$i];
    $newrs = $res[$i];

    // try to add one more word
    while ($sp <= $W &&
           $i + $newln <= $wc) {
      if ($newrs <= $res[$i]) {
        $line[$i] = $newln;
	$res[$i] = $newrs;
      }

      $sp += 1 + $wl[$i + $newln];
      $newln++;
      $newrs = $W - $sp + $res[$i + $newln];
    }
  }
}

function outputText() {
  global $line, $W, $S, $ws;
  print("\n");
  $pos = 0;
  while ($line[$pos] !== 0) {
    $end = $ws[$pos + $line[$pos]] - 1;
    $len = $end - $ws[$pos];
    outputLineWithPadding(substr($S, $ws[$pos], $len));
    $pos += $line[$pos];
  }
}

function outputLineWithPadding($s) {
  global $W;
  print(" $s");
  for ($i = strlen($s); $i < $W; $i++) {
    print("_");
  }
  print("\n");
}
