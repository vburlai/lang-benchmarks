#include <stdio.h>
#include <sys/time.h>

int N = -1;               // input
unsigned T;               // time limit (seconds)
struct timeval stopTime;  // time when we should stop
unsigned long iterations; // amount of finished cycles of computing

unsigned long res; // current value

void start();
void reinit();
void calc(int);

int main (int argc, char ** argv) {
  if (argc != 2) {
    printf("Time limit parameter required:\n ./main.bin <time>\n");
  } else {
    iterations = 0;
    sscanf(argv[1], "%d", &T);
    printf("Calculating factorial of N many times during %u seconds\n", T);
    printf("Input N:\n");

    scanf("%d", &N);
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
    calc(N);
    iterations++;
    gettimeofday(&now, NULL);
  }
  iterations--; // last iteration started before time was up but finished after time was up
  // required '>' mark for automatic benchmark
  printf("> %lu iterations\n", iterations);
  printf("Resulting %d! = %lu\n",N,res);
}

void reinit() {
  res = 1L;
}

void calc(int N) {
  for (int i = N; i > 1; i--) {
    res *= i;
  }
}
