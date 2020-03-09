var compt = require("compt");
exports.prep_before_load = function(is_initiate){
    
    var cls_before_load = new loader_before_load(is_initiate);
    
    return cls_before_load;
    
}
function loader_before_load(is_initiate){
    this.is_run = is_initiate;
    this.execute_limit_in_seconds = 5000;
    this.raw_content = "";

    this.set_content = function(content){
        this.raw_content = content;
    }

    this.get_content = function(){
       return this.raw_content;
    }
    this.execute = function(){
        this.is_run = true;
    }
}
exports.set_require_action_stream = function(name,data){

    if(compt._.has(data,name) == false){
        
        var pre_main_class = exports.prep_before_load(true);
        data[name]={
            "srcDir":[],
            "destDir":".",
            "pipe":[],
            "before_load":(function(func){

            })(pre_main_class),
            "pre_main_class":pre_main_class,
            "after_load":function(){
                
            }

        } 
    }
}