exports.green = function(message){;
    console.log("\x1b[32m"+message+"\x1b[0m");
} 

exports.red = function(message){
    console.log("\x1b[31m"+message+"\x1b[0m");
} 
