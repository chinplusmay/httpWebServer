const express = require("express");
const PORT = 8000
const app = express();
const users = require("./MOCK_DATA.json")


//REST API


app.get("/api/users", (req, res) =>{
    return res.json(users)
    
})

app
    .route("/api/users/:id")
    .get((req, res) =>{
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        return res.json(user)

    .post((req, res) =>{
        //todo create new user
        return res.json({status:"pending"});
    })
    
    .put((req, res) =>{
        //todo edit user all details
        return res.json({status:"pending"});
    })
    .patch((req, res) =>{
        //todo edit user name
        return res.json({status:"pending"});
    })
    .delete((req, res) =>{
        //todo delete user
        return res.json({status:"pending"});
    })
})

app.get("/api/users/:id", )


app.listen(PORT, () => console.log("server started"))
