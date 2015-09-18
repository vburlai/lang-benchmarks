# Justifying text

Given:

  W - width of the screen
  S - single line of text without line breaks of length n

Find one of the optimal placements of line breaks
  * each line contains L[i] characters, L[i] <= W
  * amount of unused space F(W, S), calculated as the sum of (W - L[i]), is minimal

Example:

W = 11

S = "Hello from Ukraine."

F(S, W) = 4

L[0] = Hello from_
L[1] = Ukraine.___


Memory usage: O(n)

Complexity: O(n^2)
