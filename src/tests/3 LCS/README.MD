# Computing Longest Common Subsequence (LCS) of two strings

Given:

  X - string of length n
  Y - string of length m

Find LCS (X, Y) which is a string: 
  * containing only characters which are present in both string
  * which are positioned in the same order as they are present in both strings
  * LCS is the longest of all such subsequences

Example:

X = "ABCDEF___"

Y = "__C_EF123"

LCS (X, Y) = "CEF"


Memory usage: O(n * m)

Complexity: O(n * m)
