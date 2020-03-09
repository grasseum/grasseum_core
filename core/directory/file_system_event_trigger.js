
var fs = require("fs")
var path = require("path")


var compt  = require("compt")._;


exports.begin_event_dest_write =function(config,after_load_queue){
    


          if( compt.has(config,"truncate_content") ){
          if(config['truncate_content'] && compt.has(after_load_queue,"file_truncate_complete") ==false ){
            after_load_queue['file_truncate_complete'] = true;
            
              var local_filesname = config['filename'];
              fs.writeFile(local_filesname, "", function(err)  {
                // throws an error, you could also catch it here
               // if (err) throw err;

                // success case, the file was saved
                console.log('File has been truncated!');
            });
          }
        }   
}
