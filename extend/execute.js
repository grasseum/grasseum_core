var stream_index = require("../core/stream/index");
var utilities_support = require("../utilities/support");
var pasteur = require("pasteur");
function clss_execute(config){
    
    this.config = config;
    this.require_action_stream = {};
    this.require_logs = {};
    
    this.list_executed_package = {}


} 
clss_execute.prototype.before_loadModule = function(name,func){
    var main = this;
    var main_class = utilities_support.prep_before_load(false);

    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_action_stream[name]['before_load'] = func(main_class);
    main.require_action_stream[name]['pre_main_class'] = main_class;
}

clss_execute.prototype.after_loadModule = function(name,func){
    var main = this;
    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_action_stream[name]['after_load'] = func;
}
clss_execute.prototype.loadModule = function(name,func){
    //console.log(arguments)
    var main = this;
   
    utilities_support.set_require_action_stream(name,main.require_action_stream);
    main.require_logs = []
    var args = {
        config:function(){

        },
        get_content_from_pre_load: function(){
            var local_pre_load_cls = main.require_action_stream[name]['pre_main_class'];

            return local_pre_load_cls['raw_content'];
        },
        pipe:function(){
            var arg_array = [];
            
            for(var k in arguments){
                arg_array.push(arguments[k])
            } 
            if(arg_array.length >0){
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
                     "arguments":arg_array.length>2?arg_array.splice(1):[],
                 })
            }else{
                console.log("Module was specified in PIPE function")
            }
        },
        setDirectory:function(jsn){
            if (pasteur._.getTypeof(jsn)  == "json"){
                var local_config = {};
                if(pasteur._.has(jsn,"config")){
                    local_config  = jsn["config"];
                }

                if(pasteur._.has(jsn,"srcDir")){
                    main.require_action_stream[name]['srcDir'].push({"dir":jsn['srcDir'],"config":local_config})
                }

                if(pasteur._.has(jsn,"destDir")){
                    main.require_action_stream[name]['destDir'] = {"dir":jsn["destDir"],"config":local_config}
                }

            }else{
                console.log("Invalid setting configure");
            }
        },

        viewDetails:function(){

        },
    }
    func(args)
}
clss_execute.prototype.executeModule = function(name){

    var main = this;
    
   var list_load_name = pasteur._.to_array( name ); 
   var is_module_exist = pasteur._.isExact( pasteur._.getKey(main.require_action_stream) ,list_load_name );
    
    
    var default_limit = 100;
    if(  is_module_exist ){
       
        var raw_set_limit = 0;
        var main_interval_logic = setInterval(function(){

            var module_name = list_load_name[0];
            
            var get_pre_class = main.require_action_stream[module_name]['pre_main_class'];
           

            if( (raw_set_limit * default_limit)  > get_pre_class['execute_limit_in_seconds']){
                get_pre_class.is_run = true;
            }
            raw_set_limit++;
            if(get_pre_class.is_run){ 
             
                stream_index({"require":main.require_action_stream[module_name],"config":main.config} , {
                        "cnt":0,
                        "count_file_read":0,
                        "class_after_load" : main.require_action_stream[module_name]['after_load']    
                    }) 
                
                

                list_load_name.shift();
            }
            


            if(pasteur._.count(list_load_name) == 0){
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