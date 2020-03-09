
var compt = require("compt");
var extend_command = require("./extend/command");
var extend_execute = require("./extend/execute");
var extend_watch = require("./extend/watch");

exports.execute_stream = function(argg){
    return extend_execute(argg)
}
exports.terminal_watch = function(argg){
    extend_watch()
}
exports.command_package = function(argg){
    if(typeof(argg['command']['module']) != "undefined"){
          
            extend_command.load_module_command(argg['command'])
    }else{
        console.log("Please specify the command `module` you are looking on")
    }
}