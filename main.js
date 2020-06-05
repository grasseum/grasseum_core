
let read_stream = require("./lib/read_stream");

exports.readStream = function(conf){
    let read_arg = read_stream(conf);
    return read_arg;
} 