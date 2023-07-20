const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/mycloud',{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>{
    console.log("Connection Successfull");
})
.catch((error)=>{
    console.log(error);
})
const loginschema = mongoose.Schema(
    {
        name: {
            type:String,
            required : true
        },
        password: {
            type:Number,
            required : true,
        },
        vaultnumber: {
            type:Number,
            required :true,
        },
        images : {
            type:String,
            required :false,
        },
        videos:{
            type:String,
            required:false,
        },
        audios:{
            type:String,
            required:false,
        },
        documents:{
            type:String,
            required:false,
        },
        otherfiles:{
            type:String,
            required:false,
        }

    },
    {
        timestamps:true
    }
)
const collection  = mongoose.model('collection1',loginschema);
module.exports=collection;