const stream_event = require("./lib/event/stream_event");
exports.log = function(){
    return require("./lib/console");
}

exports.terminal = function(){
    return require("./lib/terminal");
}