const express = require("express")
const mongoose = require("mongoose")
//const Mongoose= require("./Mongoose.js") 
//const bodyParser= require("body-parser")

//const item= require('./routes/api/item')
const app = express();
//Bodyparser Middleware
//app.use(bodyParser.json())
app.use(express.json())

// DB files
const db = require("./config").mongoURI;
//connect to db
mongoose
    .connect(db)
    .then(() => console.log("Connected from Server.js"))
    .catch(err => console.log(`Db connection fails error details: ${err}`))


//USE routes
app.use("/api/user",require("./routes/api/user"))
app.use("/api/profile",require("./routes/api/profile"))
app.use("/api/post",require("./routes/api/post"))
app.use("/api/auth",require("./routes/api/auth"))

// Starting the server 
const Port = process.env.PORT || 5000;
app.listen(Port, (err) => console.log(`Server running on Port ${Port}`));
