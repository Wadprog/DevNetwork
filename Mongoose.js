

var Mongoose= require("mongoose");
var dbURI='mongodb://Wadson:Poupouy12@cluster0-shard-00-00-uxi50.mongodb.net:27017,cluster0-shard-00-01-uxi50.mongodb.net:27017,cluster0-shard-00-02-uxi50.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
//'mongodb+srv://Wadson:<Poupouy12>@cluster0-uxi50.mongodb.net/test?retryWrites=true&w=majority'
/*'mongodb://JFalcon:john2522@ds119476.mlab.com:19476/hidonshabat';*/
Mongoose.connect(dbURI,{userNewUrlParser:true},function(err){    
    if(err){
    console.log('Some problem with the connection ' +err)   
    } 
    else {
    console.log('The Mongoose connection is ready')  
    }

})

module.exports=Mongoose;