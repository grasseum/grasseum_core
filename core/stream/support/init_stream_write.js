var stream_read = require("./stream_write")
var fs = require("fs")
var path = require("path")
var cls_exports = null;

var pasteur  = require("pasteur")._;


module.exports=function( file_dest,file_src ){

function file_control( local_filesname , config ){
 
     var local_attr = {};
     if( pasteur.has(config,"filename") ){
        local_filesname = config["filename"];
     }
     if( pasteur.has(config,"flags") ){
        local_attr['flags'] = config["flags"];
      }
   //?   if( pasteur.has(config,"truncate_content") ){
   //?       if(config['truncate_content']){
   //?           fs.writeFile(local_filesname, "", function(err)  {
                // throws an error, you could also catch it here
               // if (err) throw err;

                // success case, the file was saved
  //?              console.log('File has been truncated!');
    //?        });
    //?      }
  //?    }
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
            //   var dir_path = path.join("/home/pein/Desktop/workspace/experiment/nodejs/grasseum/grasseum-cli/test/concept1/test.min.js");
                //console.log("directory",dir_path)
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

