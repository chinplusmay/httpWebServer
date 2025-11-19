const http = require("http");
const fs = require("fs");


const myServer = http.createServer((req, res) =>{
    const log = `${Date.now()} : ${req.url} new req Reaceived\n`
    fs.appendFile("log.txt", log, (err, data) =>{
        switch (req.url) {
            case "/":
                res.end("Home")
                break;
            
            case "/about":
                res.end("Hey this is Chinmay")
                break;
        
            default:
                res.end("404: Not Found")
                break;
        }
        
    })
    // console.log(req.headers)
});

myServer.listen("8000", () => console.log("server started"))