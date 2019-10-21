const express= require("express")
const mongoose= require ("mongoose")
//const Mongoose= require("./Mongoose.js") 
const bodyParser= require("body-parser")

const item= require('./routes/api/item')
const app= express();
//Bodyparser Middleware
app.use(bodyParser.json())

// DB files
const db= require("./config").mongoURI;
//connect to db
mongoose
.connect(db)
.then(()=>console.log("Connected from Index.js"))
.catch(err=>console.log(`Db connection fails error details: ${err}`))
console.log("Login the db details "+ db);
//USE routes
app.use("/api/items",item)
const Port= process.env.PORT||5000; 
app.listen(Port, (err)=>console.log (`Server running on Port ${Port}`));
