var _ps  = require("pasteur")._

function StreamInit(){
    this.local_extension = ["module"]
    this.local_unique_execution = false;

}

StreamInit.prototype.setDefaultExtension=function(val){

    if(_ps.getTypeof(val) =="array"){
       
        this.local_extension=_ps.append_isArrayExist(this.local_extension,val)
    }else{
         this.local_extension=[val]
    }
}

StreamInit.prototype.setUniqueExecution=function(val){

    if(_ps.getTypeof(val) =="boolean"){
       
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