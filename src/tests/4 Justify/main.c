#include <stdio.h>
#include <string.h>
#include <sys/time.h>

char S[2047];             // input
unsigned int n;           // length of S
unsigned int W;           // width of the screen
unsigned T;               // time limit (seconds)
struct timeval stopTime;  // time when we should stop
unsigned long iterations; // amount of finished cycles of computing

unsigned int wc = 0;     // words count
unsigned int ws[2048];   // words' positions in S
unsigned int wl[2048];   // words' lengths
unsigned int line[2048]; // number of words optimal in a line
unsigned int res[2048];  // array of minimal free space for each subsequence

void start();
void reinit();
void calc();
void outputText();
void outputLineWithPadding(char *s);

int main (int argc, char ** argv) {
  if (argc != 2) {
    printf("Time limit parameter required:\n ./main.bin <time>\n");
  } else {
    iterations = 0;
    sscanf(argv[1], "%d", &T);
    printf("Calculating unused space F(W, S) for string S and width W many times during %u seconds\n", T);
    printf("Input W: ");

    scanf("%d\n", &W);

    printf("Input S: ");
    fgets(S, 2047, stdin);
    n = (unsigned int)strlen(S);
    S[--n] = 0; // trim new-line
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
  printf("Resulting F(W, S) = %u\n", res[0]);
  outputText();
}

void reinit() {
  // input parsing done only once, not counted in measurements
  if (wc == 0) {
    // count words
    wc = 1;
    for (unsigned int i = 0; i < n; i++) {
      if (S[i] == ' ') {
        wc++;
      }
    }

    // split by words
    // creating ws and wl of size wc+1
    unsigned int j = 0;
    ws[j] = 0;
    for (unsigned int i = 0; i < n; i++) {
      if (S[i] == ' ') {
        wl[j] = i - ws[j];
	j++;
	ws[j] = i + 1;
      }
    }
    wl[j] = n - ws[j];
    // EOF marker
    wl[wc] = 0;
    ws[wc] = n + 1;

    // res (allready allocated) is of size wc+2
    res[wc + 1] = 0;
    // line (allready allocated) is of size wc+1
  }
  // no cleanup needed
}

void calc() {
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

void outputText() {
  printf("\n");
  unsigned int pos = 0;
  while (line[pos] != 0) {
    S[ws[pos + line[pos]] - 1] = 0;
    outputLineWithPadding(S + ws[pos]);
    pos += line[pos];
  }
}

void outputLineWithPadding(char *s) {
  printf(" %s", s);
  for (unsigned int i = strlen(s); i < W; i++) {
    printf("_");
  }
  printf("\n");
}
