var compt = require("compt")._;

function stream_exec(){
    this.list_dir_config = [];
    this.count_list_dir = 0;
    this.cls_initialize = null;
    this.cls_require_pipe = null;
    this.cls_value_pipe = null;
}
stream_exec.prototype.set_initialize = function(cls){
    this.cls_initialize = cls;
}
stream_exec.prototype.set_require_pipe = function(cls){
    this.cls_require_pipe = cls;
}
stream_exec.prototype.set_value_pipe = function(cls){
    this.cls_value_pipe = cls;
}
stream_exec.prototype.set_src_value = function(file_dest,file_src){
    this.list_dir_config.push({
            "file_dest":file_dest,
            "file_src":file_src
    });
}

stream_exec.prototype.render_steam = function(after_load_queue){
    var main = this;
    
    if(main.list_dir_config.length > 0 ){
        var var_list = main.list_dir_config[0];
          var read_stream=main.cls_initialize.streamReader(var_list['file_src']);
           var create_stream=main.cls_initialize.streamWrite(var_list['file_dest'],var_list['file_src']);
          
          var local_stream_pipe = undefined;
          if(compt.has(main.cls_value_pipe,var_list['file_src']['ext'])){
            local_stream_pipe = main.cls_value_pipe[var_list['file_src']['ext']];

          }else{
            if(compt.has(main.cls_value_pipe,"__any__")){
                local_stream_pipe = main.cls_value_pipe["__any__"];
              }
          }
          main.cls_initialize.streamTransfom(read_stream,create_stream,local_stream_pipe,main.cls_require_pipe,main,after_load_queue)
          main.list_dir_config.shift();
  }else{

    }

}

stream_exec.prototype.fs_trigger_write_action = function(after_load_queue){
    var main = this;
    for(var i in main.list_dir_config){
        var local_dir_config = main.list_dir_config[i];
        var local_stream_pipe = undefined;
          if(compt.has(main.cls_value_pipe,local_dir_config['file_src']['ext'])){
            local_stream_pipe = main.cls_value_pipe[local_dir_config['file_src']['ext']];

          }else{
            if(compt.has(main.cls_value_pipe,"__any__")){
                local_stream_pipe = main.cls_value_pipe["__any__"];
              }
          }
        main.cls_initialize.fsBeginWriteAction(local_dir_config['file_dest'],local_dir_config['file_src'],local_stream_pipe,main.cls_require_pipe,after_load_queue)

    }
}




stream_exec.prototype.timer_trigger_acton = function(after_load_queue){
    var action_interval = null;
    var main = this;
  
    action_interval = setInterval(function(){
        main.fs_trigger_write_action(after_load_queue);
        if(main.list_dir_config.length == main.count_list_dir){
            
            clearInterval(action_interval);
            
           
  
            main.render_steam( after_load_queue );

           
         
        }else{
         
            main.count_list_dir = main.list_dir_config.length;
        }
    },100);

}
module.exports = function(){

    return new stream_exec();
}