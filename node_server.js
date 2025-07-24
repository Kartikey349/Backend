const http = require("http");

const server = http.createServer(function(req, res){

    if(req.url === "/data"){
        res.end("data page");
    }

    //.end ending the socket connection made for req
    res.end("hello world")
});

server.listen(7777);


//expressJs is made on the top of node js