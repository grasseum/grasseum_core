var compt  = require("compt")._

function StreamInit(){
    this.local_extension = ["module"]
    this.local_unique_execution = false;

}

StreamInit.prototype.setDefaultExtension=function(val){

    if(compt.getTypeof(val) =="array"){
       
        this.local_extension=compt.append_isArrayExist(this.local_extension,val)
    }else{
         this.local_extension=[val]
    }
}

StreamInit.prototype.setUniqueExecution=function(val){

    if(compt.getTypeof(val) =="boolean"){
       
        this.local_unique_execution = val;
    }
}


StreamInit.prototype.getExecutedVal=function(){

    return {
        "ext":this.local_extension,
        "is_unique_execution":this.local_unique_execution

    }
}

module.exports = function(){
    return new StreamInit()
}