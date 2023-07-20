//importing express module
const express = require("express");
 
//creating a new refrence for express module
const app = express();

//importing path module
const path = require("path");

//making public folder usage as static, inorder to use the files entire the project
app.use(express.static('public'));

app.use('/css',express.static(__dirname+'public/css'))

app.use('/img',express.static(__dirname+'public/img'))

app.use('/js',express.static(__dirname+'public/js'))

//setting an view engine
app.set("view engine", "ejs");

//creating a model object as collection
const collection = require("./models/mongodb")

//encoding the url 
app.use(express.urlencoded({extended:true}))

//importing the multer module and is used for image manipulation from site 
const multer = require('multer');

//routers used in entire project

app.get('/loginform',(req,res)=> {
    res.render('loginform');
})

app.get('/signupform',(req,res)=> {
    res.render('signupform');
})

app.get('/homepage',(req,res)=> {
    res.render('homepage');
})

app.get('/myvault',(req,res)=> {
    res.render('myvault');
})

app.get('/images',(req,res)=> {
    res.render('images')
})

app.get('/videos',(req,res)=> {
    res.render('videos')
})

app.get('/audios',(req,res)=> {
    res.render('audios')
})

app.get('/documents',(req,res)=> {
    res.render('documents')
})

app.get('/otherfiles',(req,res)=> {
    res.render('otherfiles')
})

//making disk storage using multer (a place to store the uploaded data)
const storage = multer.diskStorage({
    destination:function(req,file,cb) {
        return cb(null,"./uploads");
    },
    filename: function (req,file,cb) {
        return cb(null,`${Date.now()}--${file.originalname}`);
    },
});

//middleware
const upload = multer({ storage})


//post methods in entire process

//post method for signupform
app.post('/signupform',async (req,res)=>{
    const data={
        name:req.body.name,
        password:req.body.password,
        vaultnumber:req.body.vaultnumber,
        images:"",
        videos:"",
        audios:"",
        documents:"",
        otherfiles:"",
    }
    await collection.insertMany([data])
    
    res.render("loginform")
})

//post method for loginform 

app.post('/loginform',async (req,res)=>{

    try{
        const check = await collection.findOne({name:req.body.name})
         if(check.password==req.body.password){

            res.render("homepage");
         }else{
            res.send('<script>alert("Wrong Password or User Name"); window.location.href="/loginform";</script>');
         }
    }
    catch{
        res.send("Worng details....or plese sign in")

    }
})

//post method for homepage

app.post('/homepage',async (req,res)=>{

    try{
         if(req.body.vaultnumber){
            const check = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(check){
            res.render("myvault");
            }else{
                res.send('<script>alert("Security breach Entered a Wrong vault Number"); window.location.href = "/loginform";</script>');
                //res.render('/homepage');
            }
         }else{
            res.send('<script>alert("Please enter a valid vault Number"); window.location.href = "/homepage";</script>');
         }
         
    }
    catch{
         res.send("an error occured while loading the file....")

    }
})


//post method for images

app.post('/images',upload.single('image'),async (req,res)=>{
    if(req.file){
        if (req.body.vaultnumber){
            const img = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(img){
                var result_string=""
                const img  = await collection.findOne({vaultnumber:req.body.vaultnumber})
                if(img.images==""){
                    result_string=Date.now()+"-"+req.file.originalname;
                }else{
                    result_string = img.images+","+Date.now()+"-"+req.file.originalname;
                }
                await collection.updateOne({vaultnumber:req.body.vaultnumber},{$set:{images:result_string}});
                res.send('<script>alert("Image uploaded Successfully"); window.location.href="/images";</script>');
            }
            else{
                res.send('<script>alert("Enter a correct vault number"); window.location.href="/images";</script>');
            }
        }else{
            res.send('<script>alert("Enter a valid Vault Number"); window.location.href="/images";</script>');
        }
    }else if (req.body.vaultnumber){
        const img = await collection.findOne({vaultnumber:req.body.vaultnumber})
        if(img){
            if(img.images==""){
                res.send('<script>alert("No Images found to Display..........."); window.location.href="/images";</script>');
            }
            else{
            var out_string = ""
            const arr = img.images.split(",");
            for(let i=0;i<arr.length;i++){
                out_string=out_string+"<br>"+String(i+1)+" "+arr[i];
            }
            res.send(out_string);
            }
            
        }
        else{
            res.send('<script>alert("Please enter a Correct Vault Number"); window.location.href="/images";</script>'); 
        }

    }else {
        res.send('<script>alert("Please enter a valid Vault Number"); window.location.href="/images";</script>'); 
    }
    
})
// post method for videos

app.post('/videos',upload.single('video'),async (req,res)=>{
    if(req.file){
        if (req.body.vaultnumber){
            const vid = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(vid){
                var result_string=""
                if(vid.videos==""){
                    result_string=Date.now()+"-"+req.file.originalname;
                }else{
                    result_string = vid.videos+","+Date.now()+"-"+req.file.originalname;
                }
                await collection.updateOne({vaultnumber:req.body.vaultnumber},{$set:{videos:result_string}});
                res.send('<script>alert("Video uploaded Successfully"); window.location.href="/videos";</script>');
            }
            else{
                res.send('<script>alert("Enter a correct vault number"); window.location.href="/videos";</script>');
            }
        }else{
            res.send('<script>alert("Enter a valid Vault Number"); window.location.href="/videos";</script>');
        }
    }else if (req.body.vaultnumber){
        const vid = await collection.findOne({vaultnumber:req.body.vaultnumber})
        if(vid){
            if(vid.videos==""){
                res.send('<script>alert("No Videos found to Display..........."); window.location.href="/videos";</script>');
            }
            else{
            var out_string = ""
            const arr = vid.videos.split(",");
            for(let i=0;i<arr.length;i++){
                out_string=out_string+"<br>"+String(i+1)+" "+arr[i];
            }
                res.send(out_string);
            }
            
        }
        else{
            res.send('<script>alert("Please enter a Correct Vault Number"); window.location.href="/videos";</script>'); 
        }

    }else {
        res.send('<script>alert("Please enter a valid Vault Number"); window.location.href="/videos";</script>'); 
    }
    
})

//post method for audios 

app.post('/audios',upload.single('audio'),async (req,res)=>{
    if(req.file){
        if (req.body.vaultnumber){
            const aud = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(aud){
                var result_string=""
                if(aud.audios==""){
                    result_string=Date.now()+"-"+req.file.originalname;
                }else{
                    result_string = aud.audios+","+Date.now()+"-"+req.file.originalname;
                }
                await collection.updateOne({vaultnumber:req.body.vaultnumber},{$set:{audios:result_string}});
                res.send('<script>alert("Audio uploaded Successfully"); window.location.href="/audios";</script>');
            }
            else{
                res.send('<script>alert("Enter a correct vault number"); window.location.href="/audios";</script>');
            }
        }else{
            res.send('<script>alert("Enter a valid Vault Number"); window.location.href="/audios";</script>');
        }
    }else if (req.body.vaultnumber){
        const aud = await collection.findOne({vaultnumber:req.body.vaultnumber})
        if(aud){
            if(aud.audios==""){
                res.send('<script>alert("No Audios found to Display..........."); window.location.href="/audios";</script>');
            }
            else{
            var out_string = ""
            const arr = aud.audios.split(",");
            for(let i=0;i<arr.length;i++){
                out_string=out_string+"<br>"+String(i+1)+" "+arr[i];
            }
                res.send(out_string);
            }
            
        }
        else{
            res.send('<script>alert("Please enter a Correct Vault Number"); window.location.href="/audios";</script>'); 
        }

    }else {
        res.send('<script>alert("Please enter a valid Vault Number"); window.location.href="/audios";</script>'); 
    }
})

//poast method for documents

app.post('/documents',upload.single('document'),async (req,res)=>{
    if(req.file){
        if (req.body.vaultnumber){
            const doc = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(doc){
                var result_string=""
                if(doc.documents==""){
                    result_string=Date.now()+"-"+req.file.originalname;
                }else{
                    result_string = doc.documents+","+Date.now()+"-"+req.file.originalname;
                }
                await collection.updateOne({vaultnumber:req.body.vaultnumber},{$set:{documents:result_string}});
                res.send('<script>alert("Document uploaded Successfully"); window.location.href="/images";</script>');
            }
            else{
                res.send('<script>alert("Enter a correct vault number"); window.location.href="/documents";</script>');
            }
        }else{
            res.send('<script>alert("Enter a valid Vault Number"); window.location.href="/documents";</script>');
        }
    }else if (req.body.vaultnumber){
        const doc = await collection.findOne({vaultnumber:req.body.vaultnumber})
        if(doc){
            if(doc.documents==""){
                res.send('<script>alert("No Images found to Display..........."); window.location.href="/images";</script>');
            }
            else{
            var out_string = ""
            const arr = doc.documents.split(",");
            for(let i=0;i<arr.length;i++){
                out_string=out_string+"<br>"+String(i+1)+" "+arr[i];
            }
                res.send(out_string);
            }
            
        }
        else{
            res.send('<script>alert("Please enter a Correct Vault Number"); window.location.href="/documents";</script>'); 
        }

    }else {
        res.send('<script>alert("Please enter a valid Vault Number"); window.location.href="/documents";</script>'); 
    }
    
})

//post method for otherfiles

app.post('/otherfiles',upload.single('otherfile'),async (req,res)=>{
    if(req.file){
        if (req.body.vaultnumber){
            const otf = await collection.findOne({vaultnumber:req.body.vaultnumber})
            if(otf){
                var result_string=""
                if(otf.otherfiles==""){
                    result_string=Date.now()+"-"+req.file.originalname;
                }else{
                    result_string = otf.otherfiles+","+Date.now()+"-"+req.file.originalname;
                }
                await collection.updateOne({vaultnumber:req.body.vaultnumber},{$set:{otherfiles:result_string}});
                res.send('<script>alert("File uploaded Successfully"); window.location.href="/otherfiles";</script>');
            }
            else{
                res.send('<script>alert("Enter a correct vault number"); window.location.href="/otherfiles";</script>');
            }
        }else{
            res.send('<script>alert("Enter a valid Vault Number"); window.location.href="/otherfiles";</script>');
        }
    }else if (req.body.vaultnumber){
        const otf = await collection.findOne({vaultnumber:req.body.vaultnumber})
        if(otf){
            if(otf.otherfiles==""){
                res.send('<script>alert("No Files found to Display..........."); window.location.href="/otherfiles";</script>');
            }
            else{
            var out_string = ""
            const arr = otf.otherfiles.split(",");
            for(let i=0;i<arr.length;i++){
                out_string=out_string+"<br>"+String(i+1)+" "+arr[i];
            }
                res.send(out_string);
            }
            
        }
        else{
            res.send('<script>alert("Please enter a Correct Vault Number"); window.location.href="/otherfiles";</script>'); 
        }

    }else {
        res.send('<script>alert("Please enter a valid Vault Number"); window.location.href="/otherfiles";</script>'); 
    }
    
})

//listen on a particular port number in local host 
app.listen(4000,()=>{
    console.log("on port 4000");    
})