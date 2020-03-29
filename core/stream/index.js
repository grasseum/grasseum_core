var directory_index = require("grasseum_directory/index");
var compt  = require("compt")._
var initiliaze = require("./initiliaze");

var stream_exec = require("./../../utilities/stream_exec");

function core_stream(config,cls_stream_exec){
    this.config = config;

    this.value_pipe = {};
    this.require_pipe = {};
    this.cls_stream_exec = cls_stream_exec
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
core_stream.prototype.streamInitForDestAndSrc = function(internal_reference_value,after_load_queue){

    //console.log(this.config['require']['destAndSrcDir'],"destAndSrcDir")
    
    let main = this;
    let ref_data_src_dest_dir = {};
    this.config['require']['destAndSrcDir'].forEach(function(k,v) {
       let data_dest_and_src = compt.varExtend({"dir":[]},k )
    //    console.log(data_dest_and_src);
        data_dest_and_src['dir'].forEach(function(sk,sv){
            //console.log(sk,"sk");
            if( compt.has(sk,"dest") && compt.has(sk,"src") ){

                if(compt.has(ref_data_src_dest_dir,sv) == false){
                  
                    ref_data_src_dest_dir[sv] = {}
                    ref_data_src_dest_dir[sv]['src'] = [];
                    ref_data_src_dest_dir[sv]['dest'] = {};
                }
               (function(file_loc,ref_data_src_dest_dir,id,main){
                   
                directory_index.retrieveFileInDirectorySrc([{"dir":[file_loc]}],main.config['config']['cmd_directory'],function(file_data_src){
                  //  console.log(file_data_src,"file_data_src")
                    
                    ref_data_src_dest_dir[sv]['src'].push( file_data_src );
                })
                })(sk['src'],ref_data_src_dest_dir,sv,main);

                (function(file_loc,ref_data_src_dest_dir,id,main){

                directory_index.retrieveFileInDirectoryDest({"dir":[file_loc]},main.config['config']['cmd_directory'],function(file_data_dest){
                        
                   // console.log(file_data_dest,"file_data_dest")
                   ref_data_src_dest_dir[sv]['dest'] = file_data_dest;
                })

                })(sk['dest'],ref_data_src_dest_dir,sv,main);
            }

        });
    });
    setTimeout(function(){
       
       compt.each(ref_data_src_dest_dir,function(k,v){
           // console.log(k,v,"k,v");
           v['src'].forEach(function(sv,sk){
           
             after_load_queue['count_file_read']++;
               main.cls_stream_exec.set_src_value(v['dest'],sv);
           });
           
       });
    },50);
    
}
core_stream.prototype.streamInit = function(internal_reference_value,after_load_queue){
    var main = this;

    
    main.cls_stream_exec.set_initialize( initiliaze );

    main.cls_stream_exec.set_require_pipe(main.require_pipe);
    main.cls_stream_exec.set_value_pipe(main.value_pipe);

    var key_value_pipe = compt.getKey(main.value_pipe) 
    main.streamInitForDestAndSrc(internal_reference_value,after_load_queue);
    main.reviewSrcDir(function(file_src){
        
         main.reviewDestDir(function(file_dest){
          

           if( key_value_pipe.length==0 ){
            after_load_queue['count_file_read']++;   
            main.cls_stream_exec.set_src_value(file_dest,file_src);

           }else{
           
                if(compt.indexOf(key_value_pipe,file_src['ext']) >-1 || compt.indexOf(key_value_pipe,"__any__") >-1){
                    after_load_queue['count_file_read']++;
              
                    main.cls_stream_exec.set_src_value(file_dest,file_src);  
                
                }
                                   
           }
            
            
        })
    })
   
    
}
core_stream.prototype.preload_filesystem = function(internal_reference_value,after_load_queue){
    let main = this;

    let pre_load_interval_limit =100;

    var set_inter = setInterval(function(){
        if( internal_reference_value['is_prep_preload_complete'] ==false ){
            if(main.cls_stream_exec.list_dir_config.length == internal_reference_value['pre_file_count']){
                internal_reference_value['count_file_complete']++;
            }else{
                internal_reference_value['count_file_complete'] =0;
            }
            internal_reference_value['pre_file_count'] = main.cls_stream_exec.list_dir_config.length;
            if(internal_reference_value['count_file_complete'] >4){
                internal_reference_value['is_prep_preload_complete'] = true
            }
        }else{
                console.log("run")
                internal_reference_value['is_preload_complete'] = true;
                main.cls_stream_exec.timer_trigger_acton( internal_reference_value, after_load_queue )
            
            clearInterval(set_inter)

            
        }   
        
     
    },pre_load_interval_limit)
    

   
  

}

module.exports = function(config,internal_reference_value,after_load_queue){
        
        
      //  cre_strm.streamInit(internal_reference_value,after_load_queue)    
              var cls_stream_exec = stream_exec();
              var cre_strm = new core_stream(config,cls_stream_exec) 
               cre_strm.reviewStreamPipe()
              cre_strm.streamInit(internal_reference_value,after_load_queue) 
        //        cls_stream_exec.timer_trigger_acton(internal_reference_value,after_load_queue);
        cre_strm.preload_filesystem(internal_reference_value,after_load_queue)
       
       
}
