let compt  = require("compt")._

let stream_init = require("./support/stream_init")
let stream_transform = require("./support/stream_transform")
let stream_read = require("./support/init_stream_read")
let init_stream_write = require("./support/init_stream_write");
let utilities_directory = require("./../../utilities/directory");
let file_system_event_trigger = require("grasseum_directory/file_system_event_trigger");

const after_bootloader_module = require("../../implements/after_bootloader_module");



exports.streamReader=function(file_src){

    if(compt.has(stream_read(file_src),file_src['type'])){
        
        return stream_read(file_src)[ file_src['type'] ];
    }

}

exports.streamWrite=function(file_dest,file_src){
    if(compt.has(init_stream_write( file_dest,file_src ),file_src['type'])){
        return init_stream_write(file_dest,file_src)[file_dest['type']];
    }
    
}



exports.fsBeginWriteAction=function(file_dest,file_src,stream_pipe,require_pipe,after_load_queue){
  

   
    
    
   for(var i in stream_pipe){  
       try{
        if(compt.has(require_pipe,stream_pipe[i]['name']) == false){
            var main_require = require(stream_pipe[i]['name']);
               
             if(compt.has(main_require,"grass_stream_write") ){
                 var req_grss_minify_write = main_require.grass_stream_write;
                 
                 var req_grss_minify_write_returndata = req_grss_minify_write.apply(req_grss_minify_write,stream_pipe[i]['arguments'])
                    var local_valid_write_file_format = utilities_directory.valid_write_file_format(req_grss_minify_write_returndata);
                if(local_valid_write_file_format['is_valid']){
                    file_system_event_trigger.begin_event_dest_write( req_grss_minify_write_returndata,after_load_queue );
                }
                
                 else{
                     console.log("error module:"+stream_pipe[i]['name']+"\n");
                     console.log( local_valid_write_file_format['error_output'].join("; \n") );
                 }
             }
  
             
            
        }       
      
       
     }
     catch(e){
         console.log("Pipe_error",e)
     }
   }
  
   
}



exports.streamTransfom=function(stream_read,stream_write,stream_pipe,require_pipe,stream_init_cls,after_load_queue){
    let local_stream_transform = stream_transform() 
    let local_read_stream = stream_read({});
    
    
    
    let list_class_read_stream = [];
  
    let jsn_pipe_stream = {};
    let ary_pipe_stream_module = []; 
    let read_count = 0;
    let prep_data_after_load_queue = {};


    let reference_script_preload = [];
    let reference_script_afterload = [];


   
   prep_data_after_load_queue['count']=after_load_queue['cnt']; 
   prep_data_after_load_queue['count_file_read']=after_load_queue['count_file_read']
 
   for(var i in stream_pipe){
       try{
        if(compt.has(require_pipe,stream_pipe[i]['name']) == false){
            var main_require = require(stream_pipe[i]['name']);
            
             if(compt.has(main_require,"grass_stream_write") ){
                 var req_grss_minify_write = main_require.grass_stream_write;
                 
                 var req_grss_minify_write_returndata = req_grss_minify_write.apply(req_grss_minify_write,stream_pipe[i]['arguments'])
           
                    var local_valid_write_file_format = utilities_directory.valid_write_file_format(req_grss_minify_write_returndata);
               
            if(local_valid_write_file_format['is_valid'])
                 list_class_read_stream.push( stream_write( req_grss_minify_write_returndata ) );
                 else{
                     console.log("error module:"+stream_pipe[i]['name']+"\n");
                     console.log( local_valid_write_file_format['error_output'].join("; \n") );
                 }
             }
            if(compt.has(main_require,"grass_stream_transform") ){
                  let req_grss_minify = main_require.grass_stream_transform;
                  jsn_pipe_stream[ stream_pipe[i]['name'] ] = {
                      "arguments":stream_pipe[i]['arguments'],
                      "module":req_grss_minify
                  };
                  ary_pipe_stream_module.push("pipe(jsn_pipe_stream[ '"+stream_pipe[i]['name']+"']['module'].apply(local_stream_transform, [prep_data_after_load_queue].concat(jsn_pipe_stream['"+stream_pipe[i]['name']+"']['arguments'] )))");
                
            } 
            
            if(compt.has(main_require,"grass_script_preload") ){
                let req_grss_minify = main_require.grass_script_preload;
                reference_script_preload.push(
                    {
                        "arguments":stream_pipe[i]['arguments'],
                        "module":req_grss_minify
                    }
                )

            }
            if(compt.has(main_require,"grass_script_afterload") ){
                let req_grss_minify = main_require.grass_script_afterload;
                reference_script_afterload.push(
                    {
                        "arguments":stream_pipe[i]['arguments'],
                        "module":req_grss_minify
                    }
                )

            }
             
            
        }else{
            var req_grss_minify_class = require_pipe[stream_pipe[i]['name']]
        }           
      
       
     }
     catch(e){
         console.log("Pipe_error",e)
     }
   }
   var init_new = new Function('local_read_stream','local_write_stream','jsn_pipe_stream','local_stream_transform','prep_data_after_load_queue',"return local_read_stream."+ary_pipe_stream_module.join(".")+(ary_pipe_stream_module.length >0 ?".":"")+"pipe(local_write_stream);");
   var list_write_file_stream = [];
   let cnt_interval = 0; 
   let pre_load_interval_limit = 500;
   function load_local_func_stream(){
       if(list_write_file_stream.length <=0){
                setTimeout(function(){
            stream_init_cls.render_steam(after_load_queue);
        },10);
       }else{
       
     
               let local_var = list_write_file_stream[0];
  
              
            init_new(local_var['local_read_stream'],
                    local_var['local_write_stream'],
                    local_var['jsn_pipe_stream'],
                    local_var['local_stream_transform'],prep_data_after_load_queue).on('finish', function()  {
                        
                      
                       after_load_queue['cnt']++;
                      
                       if(after_load_queue['cnt'] == after_load_queue['count_file_read']){
                        console.log("complete . . ")
                        let cnt_interval = 0; 
                        let cls_pre_load_interval = setInterval(function(){
                        if(  compt.count(reference_script_afterload) > 0 ){
                            
                            let init_after_bootloader_module = new after_bootloader_module({
                                    "list_dir_config":stream_init_cls.list_dir_config ,
                                    "cnt_interval":cnt_interval
                                    
                            });
                            let cls_init_reference_script_afterload = reference_script_afterload[0];
                            
                        
                           

                            cls_init_reference_script_afterload['module'].apply(
                                
                                init_after_bootloader_module, [prep_data_after_load_queue].concat(cls_init_reference_script_afterload['arguments'])
                            );
                            cnt_interval++;
                      
                                
                                reference_script_afterload.shift();
                        
                        }
                        if(compt.count(reference_script_afterload) ==0){
                            after_load_queue['is_after_load_completed'] = true;
                            clearInterval(cls_pre_load_interval)
                            after_load_queue['class_after_load']()
                        }
                        
                        },pre_load_interval_limit)

                   
                       }
                       
                        read_count++;
                    });
                   
            list_write_file_stream.shift();
            
            load_local_func_stream();
         
       }
   }
   if(list_class_read_stream.length >0){
       var ref_local_read_stream = local_read_stream;
       for(var i in list_class_read_stream){
   
    list_write_file_stream.push({
       "local_read_stream":ref_local_read_stream,
       "local_write_stream":list_class_read_stream[i],
       "jsn_pipe_stream":jsn_pipe_stream,
       "local_stream_transform":local_stream_transform
   });
   
        
      }
      load_local_func_stream();
   }else{
       var local_write_stream = stream_write({});
 
   list_write_file_stream.push({
       "local_read_stream":local_read_stream,
       "local_write_stream":local_write_stream,
       "jsn_pipe_stream":jsn_pipe_stream,
       "local_stream_transform":local_stream_transform
   });
    load_local_func_stream();

   }
   
}

exports.streamTransformPipeInit=function(config,value_pipe){
  
    for(var i in config['require']['pipe']){
        var set_config = config['require']['pipe'][i];
        
        if (compt.has(set_config['require'],"grass_stream_config")) {
            
            try{
                var transform_local = stream_init()
                 set_config['require']['grass_stream_config'].call(transform_local)
                 var arry_value_pipe_arguments = {};
                 for(var i in transform_local.getExecutedVal()['ext']){
           
                        if(compt.has(value_pipe,transform_local.getExecutedVal()['ext'][i]) ==false ){
                            
                            value_pipe[transform_local.getExecutedVal()['ext'][i]] = []
                            
                        }

                        value_pipe[transform_local.getExecutedVal()['ext'][i]].push({"name":set_config['name'],"arguments":set_config['arguments']})
        

                     if(compt.has(arry_value_pipe_arguments,transform_local.getExecutedVal()['ext'][i]) == false){
                        arry_value_pipe_arguments[transform_local.getExecutedVal()['ext'][i]]={}
                     }
                    arry_value_pipe_arguments[transform_local.getExecutedVal()['ext'][i]][set_config['name']] = set_config['arguments'];
                  
                  
                    
                 }
                 if(compt.has(arry_value_pipe_arguments,"__any__")){
                     
                        var value_pipe_key = compt.to_array(compt.getKey(value_pipe));
                        
                        for(var val in value_pipe_key){
                            for(var sub_val in arry_value_pipe_arguments['__any__']){
                                
                                var method_attr = arry_value_pipe_arguments['__any__'][sub_val];
                                if(compt.has(arry_value_pipe_arguments,value_pipe_key[val]) ){
                                    if(compt.has(arry_value_pipe_arguments[ value_pipe_key[val] ] , sub_val ) ==false){
                                        value_pipe[ value_pipe_key[val] ].push({"name":sub_val,"arguments":method_attr })
                                   }

                                }else{
                                    if(compt.has(value_pipe,value_pipe_key[val]) ==false ){
                                        value_pipe[ value_pipe_key[val] ] = []
                                        
                                    }
                                    value_pipe[ value_pipe_key[val] ].push({"name":sub_val,"arguments":method_attr })
                                }

                            }

                        }
                 }
            }catch(e){
                console.log("error:",e)
            }
           
        }else{
            console.log(set_config['require'],"has no method `grass_stream_config` to initiate the stream transform")
        }
        
    }
    
}
