#include <stdio.h>
#include <string.h>
#include <sys/time.h>

char X[2047];             // input
unsigned int n;           // length of X
char Y[2047];             // input
unsigned int m;           // length of Y
unsigned T;               // time limit (seconds)
struct timeval stopTime;  // time when we should stop
unsigned long iterations; // amount of finished cycles of computing

unsigned int res[2048][2048]; // array of subsquences' max lengths

void start();
void reinit();
void calc();
void outputLCS();

int main (int argc, char ** argv) {
  if (argc != 2) {
    printf("Time limit parameter required:\n ./main.bin <time>\n");
  } else {
    iterations = 0;
    sscanf(argv[1], "%d", &T);
    printf("Calculating LCS of two strings X and Y many times during %u seconds\n", T);
    printf("Input X: ");

    fgets(X, 2047, stdin);
    n = (unsigned int)strlen(X);
    X[--n] = 0; // trim new-line
    printf("Input Y: ");
    fgets(Y, 2047, stdin);
    m = (unsigned int)strlen(Y);
    Y[--m] = 0; // trim new-line
    printf("\n");
    start();
  }
  return 0;
}

void start() {
  struct timeval now;
  gettimeofday(&stopTime, NULL);
  stopTime.tv_sec += T; // NOW + T seconds
  gettimeofday(&now, NULL);
  while (now.tv_sec <  stopTime.tv_sec ||
        (now.tv_sec == stopTime.tv_sec && now.tv_usec < stopTime.tv_usec)) {
    reinit();
    calc();
    iterations++;
    gettimeofday(&now, NULL);
  }
  iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  printf("> %lu iterations\n", iterations);
  printf("Resulting LCS(X, Y) = %u\n", res[n][m]);
  outputLCS();
}

void reinit() {
  // already allocated (limited by 2048 x 2048)
  // no cleanup needed
}

void calc() {
  for (unsigned int i = 0; i <= n; i++) {
    res [i][0] = 0;
  }
  for (unsigned int i = 0; i <= m; i++) {
    res [0][i] = 0;
  }
  for (unsigned int i = 1; i <= n; i++) {
    for (unsigned int j = 1; j <= m; j++) {
      if (X[i-1] == Y[j-1] ) {
        res [i][j] = 1 + res [i-1][j-1];
      } else {
        if (res[i-1][j] > res[i][j-1]) {
          res [i][j] = res[i-1][j];
	} else {
          res [i][j] = res[i][j-1];
	}
      }
    }
  }
}

void outputLCS() {
  unsigned int i = n, j = m;
  char substrX[2047];
  char substrY[2047];
  for (unsigned int a = 0; a < n; a++) {
    substrX[a] = '_';
  }
  substrX[n] = 0;
  for (unsigned int a = 0; a < m; a++) {
    substrY[a] = '_';
  }
  substrY[n] = 0;

  while ( i > 0 && j > 0 ) {
    if (X[i-1] == Y[j-1]) {
      i--; j--;
      substrX[i] = X[i];
      substrY[j] = Y[j];
    } else {
      if ( res[i-1][j] > res[i][j-1] ) {
        i--;
      } else {
        j--;
      }
    }
  }

  printf("\n%s   %s\n", X, Y);
  printf("%s = %s\n", substrX, substrY);
}
