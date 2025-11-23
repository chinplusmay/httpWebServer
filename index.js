const express = require("express");
const fs = require("fs");
const PORT = 8000
const app = express();
const users = require("./MOCK_DATA.json")


//middleware-plugin

app.use(express.urlencoded({extended:false}))

//REST API
app.get("/api/users", (req, res) =>{
    return res.json(users)
    
})

app.post("/api/users", (req, res) =>{
    const body = req.body;
    // console.log("Body", body)
    users.push({id: users.length+1, ...body})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err, data) =>{
        return res.json({status:"success", id:users.length});
    })
})

app
    .route("/api/users/:id")
    .get((req, res) =>{
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        return res.json(user)
    })
    .put((req, res) =>{
        //todo edit user all details
        const body = req.body;
        const id = Number(req.params.id)
        const index = users.findIndex((u) => u.id === id)
        if(index === -1) return res.status(404).json({error:"user not found"});

        users[index] = {id, ...body}

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
            return res.json({status:"user updated", id:id});
        })

    })

    .patch((req, res) =>{
        //edit some part of user
        const body = req.body;
        const id = Number(req.params.id)
        const user = users.find((u) => u.id === id)
        if (!user) return res.status(404).json({ error: "User not found" });

        Object.assign(user, body)

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
            return res.json({ status: "User partially updated", user });
        })
    })
    .delete((req, res) =>{
        //todo delete user
        const body = req.body;
        const id = Number(req.params.id)

        const index = users.findIndex((u) => u.id === id)
        if (index === -1) return res.status(404).json({error:"user not found"});
        
        const deletetedUser = users.splice(index, 1)[0];

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
            return res.json({status:"user deleted", deletetedUser});
        })

    });



app.listen(PORT, () => console.log("server started"))
