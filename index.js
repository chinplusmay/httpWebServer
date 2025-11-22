const fs = require("fs");
const url = require("url");
const express = require("express");

const app = express(); //handlerfn (instance)

app.get("/", (req, res) =>{
    res.send("Hello Form homi")
})

app.get("/about", (req, res) =>{
    res.send(`Hey ${req.query.name}`)
})



app.listen("8000", () => console.log("server started"))
