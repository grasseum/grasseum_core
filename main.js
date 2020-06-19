//let read_stream = require("./lib/read_stream");

//https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

//exports.readStream = function(conf){
//    //let read_arg = read_stream(conf);
//    //return read_arg;
//    const Vinyl = require("vinyl");
//    let vinyl_s = new Vinyl(conf);
//    vinyl_s.isGrasseum = function(){
//        return true
//    }
//    return  vinyl_s;
//} 

//exports.logsColorGreen = function(message){;
//    console.log("\x1b[32m",message,"\x1b[0m");
//} 

//exports.logsColorRed = function(message){
//    console.log("\x1b[31m",message,"\x1b[0m");
//} 

const stream_event = require("./lib/event/stream_event");
exports.log = function(){
    return require("./lib/console");
}

exports.terminal = function(){
    return require("./lib/terminal");
}