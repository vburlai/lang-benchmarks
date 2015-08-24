import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
  static long N = -1L;    // input
  static long T;          // time limit (seconds)
  static long stopTime;   // time when we should stop
  static long iterations; // amount of finished cycles of computing

  static long res;        // current value

  public static void main(String[] argv) {
    if (argv.length != 1) {
      System.out.print("Time limit parameter required:\n java Main <time>\n");
    } else {
      iterations = 0;
      T = Long.parseLong(argv[0], 10);
      System.out.print("Calculating factorial of N many times during "+T+" seconds\n");
      System.out.print("Input N:\n");

      try {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	String chunk = br.readLine();
	if (chunk != null) {
	  if (N == -1L) {
	    N = Long.parseLong( chunk.replaceFirst("\n", ""), 10);
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
    System.out.print("Resulting "+N+"! = "+res+"\n");
  }

  static void reinit() {
    res = 1L;
  }

  static void calc(long N) {
    for (long i = N; i > 1; i--) {
      res *= i;
    }
  }
}
