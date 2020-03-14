var stream_index = require("../core/stream/index");
var utilities_support = require("../utilities/support");
var compt = require("compt");

const default_limit = 500;
function clss_execute(config){
    
    this.config = config;
    this.require_action_stream = {};
    this.require_logs = {};
    
    this.list_executed_package = {}

    this.reference_for_load_module = [];


} 
clss_execute.prototype.before_loadModule = function(name,func){
    var main = this;
    var main_class = utilities_support.prep_before_load(false);

    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_action_stream[name]['pre_main_class'] = main_class;
    main.require_action_stream[name]['before_load'] = func(main_class);
    
}

clss_execute.prototype.after_loadModule = function(name,func){
    var main = this;
    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_action_stream[name]['after_load'] = func;
}
clss_execute.prototype.loadModule = function(name,func){
   
    var main = this;
   
    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_logs = []
    var local_pre_load_cls = main.require_action_stream[name]['pre_main_class'];
    var args = {
        config:function(){

        },
        get_content_from_pre_load: function(){
            

            return local_pre_load_cls['raw_content'];
        },
        pipe:function(){
            var arg_array = [];
            
            for(var k in arguments){
                arg_array.push(arguments[k])
            } 
            if(arg_array.length >0){

                try{
                    var require_name = arg_array[0]
                    if(typeof(main.list_executed_package[name]) =="undefined"){
                
                        var req_name = require(require_name)
                        main.list_executed_package[require_name] = req_name
                    }else{
                        
                        req_name = main.list_executed_package[require_name] 
                        
                    }
                    main.require_action_stream[name]['pipe'].push({
                        "name":require_name,
                        "require":req_name,
                        "arguments":arg_array.length>1?arg_array.splice(1):[],
                    })
                }catch(e){
                    console.log("Module error:",e)
                }
                
            }else{
                console.log("Module was specified in PIPE function")
            }
        },
        setDirectory:function(jsn){
            if (compt._.getTypeof(jsn)  == "json"){
                var local_config = {};
                if(compt._.has(jsn,"config")){
                    local_config  = jsn["config"];
                }

                if(compt._.has(jsn,"srcDir")){
                    main.require_action_stream[name]['srcDir'].push({"dir":jsn['srcDir'],"config":local_config})
                }

                if(compt._.has(jsn,"destDir")){
                    main.require_action_stream[name]['destDir'] = {"dir":jsn["destDir"],"config":local_config}
                }

            }else{
                console.log("Invalid setting configure");
            }
        },

        viewDetails:function(){

        },
    }
   
   var raw_set_limit = 0;
    var main_interval_logic = setInterval(function(){

        
        
     
    
       
        if( (raw_set_limit * default_limit)  > local_pre_load_cls['execute_limit_in_seconds']){
            local_pre_load_cls.is_run = true;
        }
        raw_set_limit++;
    
        if(local_pre_load_cls.is_run  ){ 
      
           
            func(args)
            main.reference_for_load_module.push( name );
             clearInterval(main_interval_logic);

            
            
            
        }
        
        

        

    },default_limit)


}
clss_execute.prototype.executeModule = function(name){

    var main = this;
    
   var list_load_name = compt._.to_array( name ); 
   var is_module_exist = compt._.isExact( compt._.getKey(main.require_action_stream) ,list_load_name );
    
    
    
    if(  is_module_exist ){
       
        
        var reference_value = {
            "cnt":0,
             "count_file_read":0,
             "is_pipe_load":true,
        };
        var raw_set_limit = 0;
        var main_interval_logic = setInterval(function(){

            if( compt._.count(main.reference_for_load_module) == compt._.count(main.require_action_stream) ) { 
          
           
                var module_name = list_load_name[0];
                
                var get_pre_class = main.require_action_stream[module_name]['pre_main_class'];
                
                if( (raw_set_limit * default_limit)  > get_pre_class['execute_limit_in_seconds']){
                    get_pre_class.is_run = true;
                }

                
            
                if(get_pre_class.is_run  && reference_value['is_pipe_load']  ){ 
                
                    console.log("Executing module `"+module_name+"`")
                    reference_value['is_pipe_load'] = false;
                    reference_value["class_after_load"] = main.require_action_stream[module_name]['after_load'] 
                    stream_index({"require":main.require_action_stream[module_name],"config":main.config} , reference_value) 
                    

                    
                    
                    
                }
                
                if(reference_value['cnt']  >= parseInt(reference_value['count_file_read'] ) ){
                    raw_set_limit = 0;
                    reference_value["cnt"] = 0;
                    reference_value["count_file_read"] =0;
                    list_load_name.shift();
                    reference_value['is_pipe_load'] = true;
                    
                }
                
            }

            
            if(compt._.count(list_load_name) == 0){
                clearInterval(main_interval_logic);
            }
        },default_limit)

      
    }else{
        console.log("Action name does not exists `load` function")
    }
   
}

module.exports = function(grss){

    return new clss_execute(grss)
}