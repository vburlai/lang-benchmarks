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
  
