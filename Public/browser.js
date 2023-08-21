document.addEventListener("click",function(e){
    if(e.target.classList.contains("edit-me")){
        let UserInput=prompt("Enter your new text")
        axios.post('/update item',{Text :UserInput}).then(
            // do something
        ).catch(
            console.log("Please Try again later")
        )
    }
})