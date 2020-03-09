var stream_read = require("./stream_read")
var fs = require("fs")
var cls_exports = '';

module.exports=function(value){

    return {
        module:function(config){
            try{
                var req_name = require(value['files'])
           
            
                var stream_write_local = stream_write()
                return req_name.grass_stream_read.call(stream_write_local,value['config'])
            }
            catch(e){
                console.log(e)
                return null
            }
        },
        files:function(config){
            try{    
                    
                return fs.createReadStream(value['files']);
            }
            catch(e){
                console.log(e)
                return null
            }
        },
        directory:function(config){
        return null
        }
    };
}