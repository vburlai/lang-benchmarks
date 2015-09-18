import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
  static String S;        // input
  static int n;           // length of S
  static int W = 0;       // width of the screen
  static long T;          // time limit (seconds)
  static long stopTime;   // time when we should stop
  static long iterations; // amount of finished cycles of computing

  static int wc;      // words count
  static int []ws;    // words' positions in S
  static int []wl;    // words' lengths
  static int []line;  // number of words optimal in a line
  static int []res;   // array of minimal free space for each subsequence

  public static void main(String[] argv) {
    if (argv.length != 1) {
      System.out.print("Time limit parameter required:\n java Main <time>\n");
    } else {
      iterations = 0;
      T = Long.parseLong(argv[0], 10);
      System.out.print("Calculating unused space F(W, S) for string S and width W many times during "+T+" seconds\n");
      System.out.print("Input W: ");

      try {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	String chunk = br.readLine();
	if (chunk != null) {
	  if (W == 0) {
	    W = Integer.parseInt( chunk.trim(), 10);
	    System.out.print("Input S: ");
	  }
	}
	chunk = br.readLine();
	if (chunk != null) {
	  if (S == null) {
	    S = chunk.trim();
	    n = S.length();
	    System.out.print("\n");
	    start();
	  }
	}
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  static void start() {
    stopTime = System.currentTimeMillis() + T * 1000; // NOW + T seconds
    while ( System.currentTimeMillis() < stopTime) {
      reinit();
      calc();
      iterations++;
    }
    iterations--; // last iteration started before time was up but finished after time was up
    // required '>' mark for automatic benchmark
    System.out.print("> "+iterations+" iterations\n");
    System.out.print("Resulting F(W, S) = "+res[0]+"\n");
    outputText();
  }

  static void reinit() {
    // input parsing done only once, not counted in measurements
    if (res == null) {
      // count words
      wc = 1;
      for (int i = 0; i < n; i++) {
        if (S.charAt(i) == ' ') {
	  wc++;
	}
      }

      // split by words
      // creating ws and wl of size wc+1
      ws = new int [wc + 1];
      wl = new int [wc + 1];
      int j = 0;
      ws[j] = 0;
      for (int i = 0; i < n; i++) {
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
      res = new int [wc + 2];
      res[wc + 1] = 0;
      // line is of size wc+1
      line = new int [wc + 1];
    }
    // no cleanup needed
  }

  static void calc() {
    // no content, no unused space
    res[wc] = 0;
    line[wc] = 0;
    for (int i = wc - 1; i >= 0; i--) {
      // start with a single word
      line[i] = 1;
      // space occupied by words
      int sp = wl[i];
      res[i] = W - sp + res[i + line[i]];

      int newln = line[i];
      int newrs = res[i];

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

  static void outputText() {
    System.out.print("\n");
    int pos = 0;
    while (line[pos] != 0) {
      outputLineWithPadding(S.substring(ws[pos], ws[pos + line[pos]] - 1));
      pos += line[pos];
    }
  }

  static void outputLineWithPadding(String s) {
    System.out.print(' ' + s);
    for (int i = s.length(); i < W; i++) {
      System.out.print('_');
    }
    System.out.print('\n');
  }
}
