module.exports.initSync = function (files) {
  var res = [];
  for (var i = 0, l = files.length; i < l; i++) {
    if (files[i].match(/\.js$/)) {
      res[res.length] = { title: 'JavaScript',
                          exec: 'node',
			  args: [files[i]] };

    }
  }
  return res;
}
