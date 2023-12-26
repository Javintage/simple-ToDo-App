 function Itemlist(){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button  data-id="${item._id}"class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
 }
 let ourHTML=items.map(function(item){
   return Itemlist(item)
 }).join('')
 document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)
//create feature
let createField=document.getElementById("create-field")
document.getElementById("create-form").document.addEventListener("submit",function(e){
    e.preventDefault()
    axios.post('/create-item',{text: createField.value}).then(function(response){
        // create the HTML for  a new item
        document.getElementById("item-list").insertAdjacentHTML("beforeend",Itemlist(response.data))
        createField.value=""
        createField.focus()
     } ).catch(
        console.log("Please Try again later")
    )
})

document.addEventListener("click",function(e){
    //Delete Feature
    if(e.target.classList.contains("delete-me")){
        if(confirm('Do you really want to delete this item permanently?')){
            axios.post('/delete-item',{id: e.target.getAttribute(data-id)}).then(function(){
                e.target.parentElement.parentElement.remove()
             }).catch(function(){
                console.log("Please Try again later")
              })

        }
    }
    //Update Feature
    if(e.target.classList.contains("edit-me")){
        let UserInput=prompt("Enter your new text",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
      if(UserInput){
        axios.post('/update-item',{Text :UserInput,id: e.target.getAttribute(data-id)}).then(function
            (){
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=UserInput
             } ).catch(
            console.log("Please Try again later")
        )
      }
    }
})