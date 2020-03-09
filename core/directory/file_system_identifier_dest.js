
var fs = require('fs');
var path = require('path');


var compt = require("compt");

function clsFileSystem(files,orig_path,func){
    this.files = files;
    this.orig_path = orig_path;

  
  
}
clsFileSystem.prototype.action_callback = function(files,func) {
        var main =this;
   
        fs.lstat(files, function(err, stats){
                
                if(stats.isFile()){
                   var file_name = files//path.join(main.orig_path,files)
                    func({"type":"files","files":file_name,"ext":path.extname(file_name).split(".")[1]})
                }
                else if(stats.isDirectory()){
                    
                  
                       func({"type":"directory","files":files})
                    // func({"type":"directory","files":path.join(main.orig_path,files)})
                }
                else{
                    console.log("Invalid filesystem")
                }
            })
}
clsFileSystem.prototype.init = function(func) {
    if(/^\.$/.test(this.files)){
        this.files = path.join(this.orig_path,this.files)
    
        this.action_callback(this.files,func)
      

    }
    else if(/^@/.test(this.files)){
        func({"type":"module","files":this.files})
     }
    else{
       //   console.log("haha");    
        this.action_callback(this.files,func)

    }

}


module.exports = function(fls,orig_path,func){
 
    var fs_cls = new clsFileSystem(fls,orig_path);
   fs_cls.init(func)

}