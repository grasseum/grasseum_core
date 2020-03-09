var file_system_identifier_src = require("./file_system_identifier_src")
var file_system_identifier_dest = require("./file_system_identifier_dest")
var compt = require("compt")._;
//https://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
exports.retrieveFileInDirectorySrc = function(list_dir,orig_path,func){
    

    
    
    var file_exist = []
    for(var i in list_dir){
  

            var local_list_dir = [];
            if( compt.getTypeof(list_dir[i]['dir']) == "array" ){
                for(var di in list_dir[i]['dir']){
                    local_list_dir.push(list_dir[i]['dir'][di]);
                }
            }else{
           

               local_list_dir.push(list_dir[i]['dir']);
            }

            for(var ldi in local_list_dir){
                     file_system_identifier_src(local_list_dir[ldi],orig_path,function(file){

                            if (compt.indexOf(file_exist,file) ==-1){
                                
                                file['config']=list_dir[i]['config']
                                file_exist.push(file)
                                func(file)
                            
                            }else{
                                console.log("Exists already",file)
                            }
                        })

            }
           
    }

}

exports.retrieveFileInDirectoryDest = function(list_dir,orig_path,func){
    


    var local_list_dir = [];


     if( compt.getTypeof(list_dir['dir']) == "array" ){
           for(var di in list_dir['dir']){
                    local_list_dir.push(list_dir['dir'][di]);
           }
    }else{
            

          local_list_dir.push(list_dir['dir']);
     }



    for(var ldi in local_list_dir){
         file_system_identifier_dest( local_list_dir[ldi] ,orig_path,function(file){
    
            file['config']
                func(file)
            })

    }

    
}