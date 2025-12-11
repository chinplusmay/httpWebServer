const express = require("express");
const mongoose = require('mongoose');
const fs = require("fs");
const PORT = 8000
const app = express();
// const users = require("./MOCK_DATA.json");
const { type } = require("os");

//conection
mongoose
    .connect("mongodb://127.0.0.1:27017/my-app")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Error: ",err))


// schema
const userSchema = new mongoose.Schema({
        firstName:{
            type: String,
            required: true,
        },

        lastName:{
            type:String,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        jobTitle:{
            type:String,
        },
        gender:{
            type:String,
        },
    },
        {timestamps:true}
);

//model
const User = mongoose.model("user", userSchema);


//middleware-plugin
app.use(express.urlencoded({extended:false}))
app.use((req, res, next) => {
    req.myName = "neha";
    console.log("hey from midware 1")
    next();
})

app.use((req, res, next) =>{
    fs.appendFile(
        "./log.txt",
        `\n ${Date.now()}: ${req.method}: ${req.path}\n`,
        (err, data) =>{
            next();
        }
    )
})

app.use((req, res, next) => {
    console.log("hey from midware 2", req.myName)
    next();
})



//REST API

app.get("/api/users", async (req, res) =>{
    const alldbUsers = await User.find({});

    const html = `
        <ul>
            ${alldbUsers.map((user) => `<li>${user.firstName}-${user.email}</li>`).join("")}
        </ul>
    `;

    return res.send(html)
})

app.post("/api/users", async (req, res) =>{
    const body = req.body;
    // console.log("Body", body)
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg : "All fields are required...."})
    }
    // users.push({id: users.length+1, ...body})
    // fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err, data) =>{
    //     return res.status(201).json({status:"success", id:users.length});
    // })
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });
    console.log(result)
    return res.status(201).json({msg: "success"});

})

app
    .route("/api/users/:id")
    .get(async (req, res) =>{
        const user = await User.findById(req.params.id)
        // const id = Number(req.params.id)
        // const user = users.find((user) => user.id === id)
        return res.json(user)
    })
    .put(async (req, res) =>{
        //todo edit user all details
        const body = req.body;
        const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                body,
                { new: true, runValidators: true, overwrite: true }
            );
        
        if(!updatedUser) return res.status(404).json({error:"user not found"});

        return res.json({
                status: "User fully updated",
                user: updatedUser,
            });

    })

    .patch(async (req, res) =>{
        //edit some part of user
        const body = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {$set:body}, //update object opr used to set the value of a field in a document
            {new:true, runValidators:true} // new: returns the updated document after the modifications 
                //runValidators: rules(required minlen maxlen) applied
             
        )
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        return res.json({
                status: "User fully updated",
                user: updatedUser,
        });
    })
    .delete((req, res) =>{
        //todo delete user
        const body = req.body;
        
        const deletedUser = User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        return res.json({
                status: "User deleted",
                deletedUser,
        })

    });



app.listen(PORT, () => console.log("server started"))
