var _ps  = require("pasteur")._

function StreamInit(){
    this.local_extension = ["module"]

}

StreamInit.prototype.setDefaultExtension=function(val){

    if(_ps.getTypeof(val) =="array"){
       
        this.local_extension=_ps.append_isArrayExist(this.local_extension,val)
    }else{
         this.local_extension=[val]
    }
}


StreamInit.prototype.getExecutedVal=function(){

    return {
        "ext":this.local_extension

    }
}

module.exports = function(){
    return new StreamInit()
}