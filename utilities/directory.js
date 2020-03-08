var fs = require("fs")
var path = require("path")
var cls_exports = null;

var pasteur  = require("pasteur")._;

exports.valid_write_file_format = function(arg_req){
    
    var local_arg = {
        "is_valid":false,
        "error_output":[]
    };

      if( pasteur.has(arg_req,"filename") ){
        //local_filesname = config["filename"];

        if( fs.existsSync( arg_req['filename'] ) ){
            local_arg['is_valid'] = true;
        }
        if ( local_arg['is_valid'] == false){
            var filename_split = arg_req['filename'].toString().split("/");
        //    console.log(filename_split,"filename_split");
            var limit_split_path = pasteur.limit(filename_split,0,filename_split.length -2);
            var limit_ary_split = [];

            for(var i in limit_split_path){
                limit_ary_split.push( limit_split_path[i] );
            }
             if( fs.existsSync( limit_ary_split.join("/")) ) {
                local_arg['is_valid'] = true;
            }else{
                 local_arg['is_valid'] = false;
                    local_arg['error_output'].push("filename doest not exists");  
            }
        }
     }else{
        local_arg['is_valid'] = false;
        local_arg['error_output'].push("filename doest not exists");  
     }
   
       if( pasteur.has(arg_req,"flags") && local_arg['is_valid']){
       
          var list_valid_attr =[
                    "a",
                    "ax",
                    "a+",
                    "ax+",
                    "as",
                    "as+",
                    "r",
                    "r+",
                    "rs+",
                    "w",
                    "wx",
                    "w+",
                    "wx+"    
                ];
          if (pasteur.indexOf(list_valid_attr,arg_req['flags']) >=0)
             local_arg['is_valid'] = true;
          else{
               local_arg['is_valid'] = false; 
               local_arg['error_output'].push("Invalid flags format"); 
                }
         }
       if( pasteur.has(arg_req,"truncate_content") && local_arg['is_valid'] ){
            
                if(pasteur.getTypeof(arg_req['truncate_content']) =="boolean")
                    local_arg['is_valid'] =  true;
                else{
                    local_arg['is_valid'] = false; 
                     local_arg['error_output'].push("truncate_content must be boolean"); 
                }    
       }
    
    
      

    return local_arg;
}