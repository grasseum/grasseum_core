//https://github.com/gulpjs/vinyl/blob/master/index.js

var isBuffer = require('buffer').Buffer.isBuffer;

function isStream(stream) {
    if (!stream) {
      return false;
    }
  
    if (typeof stream.pipe !== 'function') {
      return false;
    }
  
    return true;
  }

  var builtInFields = [
    '_contents', '_symlink', 'contents', 'stat', 'history', 'path',
    '_base', 'base', '_cwd', 'cwd',
  ];
class ReadStream{

    constructor( file ){
        var self = this;
        if (!file) {
            file = {};
          }
        
          this.stat = file.stat || null;

          // Contents = stream, buffer, or null if not read
          this.contents = file.contents || null;
        
          // Replay path history to ensure proper normalization and trailing sep
          var history = Array.prototype.slice.call(file.history || []);
          if (file.path) {
            history.push(file.path);
          }
          this.history = [];
          self.path = file.path || null;
          history.forEach(function(path) {
           // self.path = path;
          });
        
          this.cwd = file.cwd || process.cwd();
          this.base = file.base || null;
        
          this._isVinyl = true;
        
          this._symlink = null;
        
          // Set custom properties
         Object.keys(file).forEach(function(key) {
            if (self.isCustomProp(key)) {
              self[key] = file[key];
            }
          });
    }
    isCustomProp(key) {
      return builtInFields.indexOf(key) === -1;
    };
    isBuffer() {
        return isBuffer(this.contents);
      };
    isStream(){
        return isStream( this.contents );
    }
    isNull(){
        return this.contents == null;
    }

}

module.exports = function( file ){
    return new ReadStream(  file );
}