const http = require("http");
const fs = require("fs");
const url = require("url");
const express = require("express");


function handlerFn(req, res){
    const log = `${Date.now()} : ${req.url} new req Reaceived\n`
    if (req.url === "/favicon.ico") return res.end();
    const myUrl = url.parse(req.url, true);
    console.log(myUrl)


    fs.appendFile("log.txt", log, (err, data) =>{


        switch (myUrl.pathname) {
            case "/":
                res.end("HomePage")
                break;
            
            case "/about":
                const username = myUrl.query.myname
                console.log(username)
                res.end(`Hey there ${username}`)
                break;
            case "/search":
                const search = myUrl.query.searchquery
                console.log(search)
                res.end(`Your results for ${search}`)
            break;
        
            default:
                res.end("404: Not Found")
                break;
        }
        
    })
    // console.log(req.headers)
}

const myServer = http.createServer(handlerFn)

myServer.listen("8000", () => console.log("server started"))