exports.load_module_command=function(path,arg){
    try{
       var reqq=  require(path['module'])
        reqq.grasseum_command()
        
    }catch(e){
        console.log("Module error",e)
    }

} 