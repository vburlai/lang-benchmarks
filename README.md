# Language comparison benchmarks

This is a simple project to compare how fast various languages can run, for example, C vs PHP vs Java.

# Requirements

* Node.JS version 0.12+ ('node' should be in PATH)

# Optional

* JDK for Java code ('java' and 'javac' should be in PATH)
* GCC (on Mac OS X it comes with XCode App from the App Store)
* Emscripten ('emcc' should be in PATH)
* PHP ('php' should be in PATH)

# Running

Run all tests with `npm start`

# Example

It shows somehing line this on my machine:

```
Overall summary (from fastest to slowest):
|######################################################### 1000  C
|################################################           836  Java
|##############################                             530  C (non-opt)
|##########################                                 449  Emscripten
|###################                                        333  Emscripten (non-opt)
|##########                                                 174  JavaScript
|##                                                          42  PHP
```
