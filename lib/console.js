//https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

exports.green = function(message){;
    console.log("\x1b[32m"+message+"\x1b[0m");
} 

exports.red = function(message){
    console.log("\x1b[31m"+message+"\x1b[0m");
} 
