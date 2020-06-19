const compts = require("compts");
exports.getCwdParameter = function(cwd){
    var glb={};
    compts._.each(cwd,function(k,v){
        var is_valid = /^([-]{2})/g.test(v);
        if(is_valid){
            
            var split_val = v.split("=");
            var split_key = split_val[0].replace(/^([-]{2})/g,"")
            if(split_val.length==1 ){
                glb[ split_key ]=true;
            } else{
                glb[ split_key ]=compts._.to_array(compts._.getValue(compts._.limit(split_val,1,split_val.length-1))).join("=");
            }
        }
        
    });
    return glb;
}