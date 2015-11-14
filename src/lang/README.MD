# Language modules

## API

### module.exports.initSync(files)
  Given the list of files, do the cleanup and compilation of needed files.

  Returns: an array of processes to execute in the following form:
  ```javascript
     [ { 'title': '...',
         'exec':  '...',
         'args': ['a', 'b', 'c'] },
         ...] 
  ```
  If some test is missing the platform to run it, the following is returned:
  ```javascript
     [ { 'title': '...',
         'missing': '...' },
	 ...]
  ```
  
