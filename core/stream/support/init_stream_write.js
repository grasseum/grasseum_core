var stream_read = require("./stream_write")
var fs = require("fs")
var path = require("path")
var cls_exports = null;

var compt  = require("compt")._;


module.exports=function( file_dest,file_src ){

function file_control( local_filesname , config ){
 
     var local_attr = {};
     if( compt.has(config,"filename") ){
        local_filesname = config["filename"];
     }
     if( compt.has(config,"flags") ){
        local_attr['flags'] = config["flags"];
      }
  
      return {
          "local_filesname":local_filesname,
          "local_attr":local_attr
      }
}
    return {
            module:function(config){
                try{
                    var req_name = require(file_dest['files'])
                    var stream_write_local = stream_write()
                    return req_name.grass_stream_write.call(stream_write_local,file_dest['config'])
                }
                catch(e){
                    console.log(e)
                    return null
                }
            },
            files:function( config ){
                try{

                    var local_filesname = file_dest['files'];
                    

                    var local_file_control = file_control( local_filesname , config );

                    return fs.createWriteStream(local_file_control['local_filesname'],local_file_control['local_attr']);
                }
                catch(e){
                    console.log(e)
                    return null
                }
            },
            directory:function( config ){
                var  dir_path= path.join(file_dest['files'],path.basename(file_src['files']));
                try{
                    var local_filesname = dir_path;
                   
                    var local_file_control = file_control( local_filesname , config );
                    
                    return fs.createWriteStream(local_file_control['local_filesname'], local_file_control['local_attr']);
                }
                catch(e){
                    console.log(e)
                    return null
                }
            }
        };
}


