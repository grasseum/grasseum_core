const _ps  = require("compt")._


let read_file = require("grasseum_directory/read_file");
let write_file = require("grasseum_directory/write_file");
function AfterBootloaderModule(glb){
    this.list_dir_config= glb['list_dir_config'];
    this.cnt_interval = glb['cnt_interval'];
    this.is_completed = false;
    this.is_file_src_complete = false;
    this.maximum_expiration = 100;
    this.current_file = {};

    this.getFileSrc = function(func){
        let main = this;

        if(main.is_file_src_complete == false){
            if (_ps.count(this.list_dir_config) >0 ){
                main.is_file_src_complete = true;
                main.current_file = main.list_dir_config[0];
                read_file.read_file_ut8(main.list_dir_config[0]['file_src']['files'],function(res){
                   
                    func.call(main,res);
                   
                });
            
            }else{
                main.is_file_src_complete = true;
                func.call(main,{
                    is_file_exists : false,
                    data : "",
                    
                })
            }
        }
    }

    this.getFileDest = function(func){
        let main = this;

        if (_ps.count(this.list_dir_config) >0 ){
            
            read_file.read_file_ut8(main.list_dir_config[0]['file_dest']['files'],func);
        }else{
            func({
                is_file_exists : false,
                data : ""
            })
        }
    }
}

module.exports = function(glb){
    return new AfterBootloaderModule(glb)
}