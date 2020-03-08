var directory_index = require("../directory/index");
var ps  = require("pasteur")._
var initiliaze = require("./initiliaze");

var stream_exec = require("./../../utilities/stream_exec");
//home/pein/Desktop/workspace/experiment/nodejs/stream_example/exp_stream/exp_stream/concep3
function core_stream(config){
    this.config = config;

    this.value_pipe = {};
    this.require_pipe = {};
}
core_stream.prototype.reviewSrcDir = function(func){
     directory_index.retrieveFileInDirectorySrc(this.config['require']['srcDir'],this.config['config']['cmd_directory'],function(file_data){
        
         func(file_data)
     })
}

core_stream.prototype.reviewDestDir = function(func){
    directory_index.retrieveFileInDirectoryDest(this.config['require']['destDir'],this.config['config']['cmd_directory'],function(file_data){
        func(file_data)
    })
}

core_stream.prototype.reviewStreamPipe = function(){
   
  
   initiliaze.streamTransformPipeInit(this.config,this.value_pipe);
}
core_stream.prototype.streamInit = function(after_load_queue){
    var main = this;

    var cls_stream_exec = stream_exec();
    cls_stream_exec.set_initialize( initiliaze );

    cls_stream_exec.set_require_pipe(main.require_pipe);
    cls_stream_exec.set_value_pipe(main.value_pipe);

    var key_value_pipe = ps.getKey(main.value_pipe) 
   
    main.reviewSrcDir(function(file_src){
        
         main.reviewDestDir(function(file_dest){
          

           if( key_value_pipe.length==0 ){
                
                cls_stream_exec.set_src_value(file_dest,file_src);
           }else{
           
                if(ps.indexOf(key_value_pipe,file_src['ext']) >-1 || ps.indexOf(key_value_pipe,"__any__") >-1){
                    after_load_queue['count_file_read']++;
                    cls_stream_exec.set_src_value(file_dest,file_src);   
                          }//else{
                           // if(ps.indexOf(key_value_pipe,"__any__") >-1 ){
                          //      after_load_queue['count_file_read']++;
                          //      cls_stream_exec.set_src_value(file_dest,file_src);   
                         //             }
                         // }
                                   
           }
            
            
        })
    })
    cls_stream_exec.timer_trigger_acton(after_load_queue);

}
module.exports = function(config,after_load_queue){
   
        var cre_strm = new core_stream(config) 
        cre_strm.reviewStreamPipe()
        
        

        cre_strm.streamInit(after_load_queue)
}