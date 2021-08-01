

//------------------------------ON LOAD--------------------------------------------------------

//------------------------------eventListeners----------------------------------------
document.querySelector(".input-div input").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        enterInput(event);
    }
});

document.querySelector(".add-btn").addEventListener("click", function() {
    addButtonClick();
});

document.querySelector(".clear-completed").addEventListener("click", function() {
    clearCompleted();
});


document.querySelector(".theme-icon").addEventListener("click", function() {
    toggleTheme();
    updateTheme()
});
//------------------------------------------------------------------------------------

//set to "All" if filterActive is unset
if(localStorage.getItem('filterActive') == null){
    localStorage.setItem('filterActive', 'All')
}

updateTheme();
 
addEventListeners();

updateList();

countItemsLeft();

//---------------------------------------------------------------------------------------------




/***************************************************************************************/
/***                                    FUNCTIONS                                    ***/
/***************************************************************************************/

//------------------add event listeners for multiple items------------------
// when the list is updated, it means that the items of the div a renewed, so a function is needed to be called so it will add event listeners again.
function addEventListeners(){
     //select check-icons and text-titles for each item on the list and add "listItemClick()" function as click event
    document.querySelectorAll(".check-div, .list-item-title").forEach(item => {
        item.addEventListener('click', event => listItemClick(item))
    });
    
    //select delete icons for each item on the list and add "deleteElement()" function as click event
    document.querySelectorAll(".delete-icon").forEach(item => {
        item.addEventListener('click', event => deleteElement(event))
    });

    //select all filters and add "filterClick()" function as click event
    document.querySelectorAll(".filter-item").forEach(item => {
        item.addEventListener('click', event => filterClick(item))
    });


    
}

//------------------when "Enter" key is pressed on the input------------------
function enterInput(event){
    var text = event.target.value;

    //if input is not empty
    if(!text == ''){
        var newItem = {"text": text, "completed": false};

        //get list with items from localStorage
        var array = JSON.parse(localStorage.getItem("listItems"));

        //add new item to the list
        array.push(newItem);

        //update listItems on localStorage
        localStorage.setItem("listItems", JSON.stringify(array));

        updateList();
        event.target.value = ""; //reset the input
    }
    
    
    
    addEventListeners();
    updateList();
    filtersRefreshList();
    countItemsLeft();
    updateTheme();
    
}

//------------------when add button is clicked------------------
function addButtonClick(){
    var input = document.querySelector(".input-div input");
    
    if(!input.value == ''){
        var element = {"text": input.value, "completed": false};

        var array = JSON.parse(localStorage.getItem("listItems"));
        array.push(element);
    
        localStorage.setItem("listItems", JSON.stringify(array));
    
        updateList();
        input.value = "";
    }

    addEventListeners();
    updateList();
    filtersRefreshList();
    countItemsLeft();
    updateTheme();
   
}


//------------------When you click a filter------------------
function filterClick(node){
    var filters = document.querySelectorAll(".filter-item");

    //remove active class to all filters
    filters.forEach(item => {
        item.classList.remove("filter-active");
    })

    //add active class the filter that is clicked
    node.classList.add("filter-active");

    //if "All" filter is clicked
    if(node.innerHTML == "All"){

        //change "filterActive" in localStorage to "All"
        localStorage.setItem('filterActive', 'All');
    
    //if "Active" filter is clicked
    }else if(node.innerHTML == "Active"){
        localStorage.setItem('filterActive', 'Active');

    //if "Completed" filter is clicked
    }else{
        localStorage.setItem('filterActive', 'Completed');
    }


    filtersRefreshList();
   
}

//------------------Refresh list when changing filter------------------
function filtersRefreshList(){
    var listItems = document.querySelectorAll("li");

    //get filter state(All/Active/Completed) from localStorage
    var filterActive = localStorage.getItem('filterActive');

    //if filter state is "All"
    if(filterActive == "All"){

        //remove the class "hidden" for every item on the list
        listItems.forEach(item => {
            item.classList.remove("hidden");
        })

    //if filter state is "Active"
    }else if(filterActive == "Active"){
       
        listItems.forEach(item => {
            if(item.classList.contains("completed")){
                //add the class "hidden" if item is "completed"
                item.classList.add("hidden");
            }else{
                //remove the class "hidden" if item is "completed"
                item.classList.remove("hidden");
            }
            
        })
    
    //if filter state is "Completed"
    }else{

        listItems.forEach(item => {
            if(item.classList.contains("completed")){
                 //remove the class "hidden" if item is "completed"
                item.classList.remove("hidden");
            }else{
                //add the class "hidden" if item is "completed"
                item.classList.add("hidden");
            }
            
        })
    }

    updateLocalStorageArray();
}



//------------------Update localStorage Array------------------
function updateLocalStorageArray(){
    var array = [];

    //get elements from the List
    var elements = document.querySelectorAll("li");

    //add elements in array
    elements.forEach(item => {
        var text = item.querySelector(".list-item-title").innerHTML;
        var isCompleted = (item.classList.contains("completed") ? true : false);
        array.push({"text": text, "completed": isCompleted});
    })

    //update localStorage "listItems" with the new array
    localStorage.setItem('listItems', JSON.stringify(array));
}

//------------------Add element------------------
function addElementToDom(element, index){
    
    var text = element.text;
    const newElement = document.createElement("li");
    
    //if its light-theme
    var theme = (localStorage.getItem("theme") == "light") ? "light-theme" : "";

    if(element.completed){
        newElement.classList.add("completed");
    }

    newElement.innerHTML = `
    <div class="list-item `+theme+`">
        <div class="check-div"><img class="check-icon `+theme+`" src="images/icon-check.svg"/></div>
        <span class="list-item-title `+theme+`">`+text+`</span>
        <img class="delete-icon" data-index="`+index+`" src="images/icon-cross.svg"/>
    </div>
   
    `;

    const list = document.querySelector(".list");
    list.appendChild(newElement);
}

//------------------Delete element------------------
function deleteElement(e){
    var array = JSON.parse(localStorage.getItem("listItems"));
    var index = e.target.getAttribute("data-index");

    array.splice(index, 1);
    localStorage.setItem("listItems", JSON.stringify(array));

    updateList();
}

//------------------Get items from localStorage and add them to the list div------------------
function updateList(){
    var array = JSON.parse(localStorage.getItem("listItems"));

    document.querySelector(".list").innerHTML = "";
    
    var index = 0; 
    array.forEach(item => {
        addElementToDom(item, index++);
    })

    addEventListeners();
    countItemsLeft();
    
}


//------------------Delete items that are completed------------------
function clearCompleted(){
    var originalArray = JSON.parse(localStorage.getItem("listItems"));
    var newArray = [];

    
    originalArray.forEach(item => {
        //if item is not completed than add it to the new array
        if(!item.completed == true){
            newArray.push(item);
        }
    
    })

    //change the old array with the new one which has only the items that are not commpleted
    localStorage.setItem("listItems", JSON.stringify(newArray));

    addEventListeners();
    updateList();
    filtersRefreshList();
    countItemsLeft();

}

//------------------When item is clicked (either check icon or the text)------------------
function listItemClick(node){
    //get list-item div
    var parent = node.parentElement.parentElement;

    //if list-item has the class "completed" than remove it
    if(parent.classList.contains("completed")){

        parent.classList.remove("completed");
    
    //if list-item doesn't have the class "completed" than add it
    }else{
        parent.classList.add("completed");
    }

    filtersRefreshList();
    countItemsLeft();
}


//------------------Count and update how many items are not completed------------------
function countItemsLeft(){
    var allItems = document.querySelectorAll("li");
    var count = 0;

    allItems.forEach(item => {
        if(!item.classList.contains("completed")){
            count++;
        }
    })

    var counter = document.querySelector(".item-left-counter");

    if(count == 1){
        counter.innerHTML = count + " item left";
    }else{
        counter.innerHTML = count + " items left";
    }
    
}


//------------------toggle theme when clicked------------------
function toggleTheme(){
    
    //if theme is light than change it to dark
    if(localStorage.getItem("theme") == "light"){

        localStorage.setItem("theme", "dark");

    //if theme is dark than change it to light
    }else{
        localStorage.setItem("theme", "light");
    }
}

//------------------change and update color to elements based on theme------------------
function updateTheme(){
    //select all elements that needs to be updated when theme is toggled
    var elements = document.querySelectorAll(
    "body, header, .input-div, input, #list-div, li,"+
    ".list-item, .list-item-title, .check-icon, .check-div, .completed .check-div, .completed .check-icon,"+
    ".item-left-counter, .filter-item, .filter-item:hover, .filter-active,"+
    ".clear-completed, .clear-completed:hover, .drag-drop-text, .list-filters-mobile, footer, footer a"
    );
    
    //get theme icon element
    var themeIcon = document.querySelector(".theme-icon");
    
    //if theme is "light" on localStorage
    if(localStorage.getItem("theme") == "light"){

        //for every element that is selected add the class "light-theme"
        elements.forEach(item => {
            item.classList.add("light-theme");
        })

        //theme-icon change to moon icon
        themeIcon.src = "/images/icon-moon.svg";
    }else{
        elements.forEach(item => {
            item.classList.remove("light-theme");
        })

        themeIcon.src = "/images/icon-sun.svg";
    }
}


