import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
  static int  N = -1;     // input
  static long T;          // time limit (seconds)
  static long stopTime;   // time when we should stop
  static long iterations; // amount of finished cycles of computing

  static long []res;      // array of current value and previous 3 numbers

  public static void main(String[] argv) {
    if (argv.length != 1) {
      System.out.print("Time limit parameter required:\n java Main <time>\n");
    } else {
      iterations = 0;
      T = Long.parseLong(argv[0], 10);
      System.out.print("Calculating N's Fibonacci number many times during "+T+" seconds\n");
      System.out.print("Input N:\n");

      try {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	String chunk = br.readLine();
	if (chunk != null) {
	  if (N == -1L) {
	    N = Integer.parseInt( chunk.replaceFirst("\n", ""), 10);
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
      calc(N);
      iterations++;
    }
    iterations--; // last iteration started before time was up but finished after time was up
    // required '>' mark for automatic benchmark
    System.out.print("> "+iterations+" iterations\n");
    System.out.print("Resulting F("+N+") = "+res[(N-1) & 3]+"\n");
  }

  static void reinit() {
    if(res == null) {
      res = new long[] {1L, 1L, 2L, 3L};
    } else {
      res[0] = 1L;
      res[1] = 1L;
      res[2] = 2L;
      res[3] = 3L;
    }
  }

  static void calc(long N) {
    for (int i = 4; i < N; i++) {
      res[i & 3] = res[(i-1) & 3] + res[(i-2) & 3];
    }
  }
}
