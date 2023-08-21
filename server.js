let express =require("express")
let {MongoClient}=require('mongodb')
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
App.use(express.urlencoded({extended:false}))
App.get('/',function(req,res){
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
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
        
          ${items.map(function(){
            return `  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
          }).join('')}
        </ul>
        
      </div>
      <script src ="/browser.js"></script>
    </body>
    </html>`)
  })
   
})
App.post('/create-item',function(req,res){
    db.collection("items").insertOne({text:req.body.item},function(){
        res.redirect('/')
    })
})

