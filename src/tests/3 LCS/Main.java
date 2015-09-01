import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
  static String X;        // input
  static int n;           // length of X
  static String Y;        // input
  static int m;           // length of Y
  static long T;          // time limit (seconds)
  static long stopTime;   // time when we should stop
  static long iterations; // amount of finished cycles of computing

  static int [][]res; // array of subsquences' max lengths

  public static void main(String[] argv) {
    if (argv.length != 1) {
      System.out.print("Time limit parameter required:\n java Main <time>\n");
    } else {
      iterations = 0;
      T = Long.parseLong(argv[0], 10);
      System.out.print("Calculating LCS of two strings X and Y many times during "+T+" seconds\n");
      System.out.print("Input X: ");

      try {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	String chunk = br.readLine();
	if (chunk != null) {
	  if (X == null) {
	    X = chunk.trim();
	    n = X.length();
	    System.out.print("Input Y: ");
	  }
	}
	chunk = br.readLine();
	if (chunk != null) {
	  if (Y == null) {
	    Y = chunk.trim();
	    m = Y.length();
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
    System.out.print("Resulting LCS(X, Y) = "+res[n][m]+"\n");
    outputLCS();
  }

  static void reinit() {
    if(res == null) {
      // create 2-dimensional array (n+1) x (m+1)
      res = new int [n+1][];
      for (int i = 0; i <= n; i++) {
        res [i] = new int [m+1];
      }
    }
    // no cleanup needed
  }

  static void calc() {
    for (int i = 0; i <= n; i++) {
      res [i][0] = 0;
    }
    for (int i = 0; i <= m; i++) {
      res [0][i] = 0;
    }
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= m; j++) {
        if (X.codePointAt(i-1) == Y.codePointAt(j-1)) {
	  res [i][j] = 1 + res [i-1][j-1];
	} else {
	  res [i][j] = Math.max( res[i-1][j], res[i][j-1] );
	}
      }
    }
  }
  static void outputLCS() {
    int i = n, j = m;
    char []substrX = X.replaceAll(".","_").toCharArray();
    char []substrY = Y.replaceAll(".","_").toCharArray();

    while ( i > 0 && j > 0) {
      if (X.codePointAt(i-1) == Y.codePointAt(j-1)) {
        i--; j--;
	substrX[i] = X.charAt(i);
	substrY[j] = Y.charAt(j);
      } else {
        if ( res[i-1][j] > res[i][j-1] ) {
	  i--;
	} else {
	  j--;
	}
      }
    }

    System.out.print("\n" + X + "   " + Y + "\n");
    System.out.print(new String(substrX) + " = " + new String(substrY) + "\n");
  }
}
