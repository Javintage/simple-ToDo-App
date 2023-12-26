let express =require("express")
let {MongoClient,ObjectId}=require('mongodb')
let sanitizeHTML=require('sanitize-html')
let App = express()
App.use(express.static('Public'))
let db
async function go(){
  let client= new MongoClient('mongodb+srv://TodoAppUser:timmovintage@cluster0.glbfvsn.mongodb.net/TodoApp?retryWrites=true&w=majority')
  await client.connect()
  db=client.db()
  App.listen(3000)

}
go()
App.use(express.json())
App.use(express.urlencoded({extended:false}))
 function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic Realme="Simple ToDo App"')
  console.log(req.headers.authorization )
  if(req.headers.authorization='Placeholder'){
   next()
  }
  else{
  res.status(401).send("Authentication Required")
  }
  next()
 }
App.get('/',passwordProtected,function(req,res){
  db.collection("items").find().toArray(function(err,items){
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form  id ="create-form"action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id ="item-list" class="list-group pb-5"></ul>
        
      </div>
      <script>
      let items=${JSON.stringify(items)}</script>
      <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
      <script src ="/browser.js"></script>
    </body>
    </html>`)
  })
   
})
App.use(passwordProtected)
App.post('/create-item',function(req,res){
  let Safetext=sanitizeHTML(req.body.text,{ allowedTags :[], allowedAttributes :{}})
    db.collection("items").insertOne({text :Safetext},function(err,info){
      res.json({_id :info.insertId,text :Safetext})
        
    }) 
})
App.post('/update-item',function(req,res){
  let Safetext=sanitizeHTML(req.body.text,{ allowedTags :[], allowedAttributes :{}})
  db.collection('items').findOneandUpdate({_id : new ObjectId(req.body.id)},{$set :{ text :Safetext}},function(){
    res.send("Success")
  })
})
App.post('/delete-item',function(req,res){
  db.collection('items').deleteOne({_id : new ObjectId(req.body.id)},function(){
    res.send("Deleted Successfully")
  })
})


