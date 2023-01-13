const budgetAmount = document.getElementById("budget-amount") //budget input
const productTitle = document.getElementById("product-title") //product name
const productCost = document.getElementById("product-cost") //product cost
const setBudgetBttn = document.getElementById("budget-button") //budget no. button
const productBttn = document.getElementById("product-button") // pdt button
const detailsDisplay = document.querySelector("#display"); //display panel
const displayBudget = document.querySelector("#total-budget-display")  // budget no. display (total budget)
const displayExpense = document.querySelector("#total-expense-display") // (expense)
const displayBalance= document.querySelector("#balance-remaining") //balance
const itemList = document.querySelector("#list-container")  // "expense list" + list adding
const list = document.querySelector("#list"); //listing of items
const budgetError = document.querySelector("#budget-error-display") 
const productError = document.getElementById("product-error-display")
const alert = document.querySelector(".alert")
const cross = document.querySelector(".closebtn")  // NOTE: use querySelector to console log the classList
var expense = 0, balance //initialization of expense 

var setBudget = JSON.parse(localStorage.getItem("budgetValue")) || []; //.value gives a string so we use parseInt()
var cost = parseInt(productCost.value);//taking the entered product cost
var productName= productTitle.value //name of product
var balance ,id 


var expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

//function for item object and appening to main container
const itemObject = (id,object,price) => {
   const itemDiv = document.createElement("div");
   const itemContain =document.createElement("span");
   itemContain.className = "item" ;

      itemContain.innerHTML = `
           <ul>${object}</ul>
           <ul>${price}</ul>
           <button><i class="fa-solid fa-pen-to-square edit" onClick="editItem('${id}')"></i></button>
           <button><i class="fa-solid fa-trash-can trash" onClick="deleteItem('${id}')"></i></button>
           `
           
   itemDiv.appendChild(itemContain);
   list.appendChild(itemDiv);  
   itemList.appendChild(list);
   itemList.style.display =  "flex";
   list.style.fontSize = "0.7em" ;


} 

function calReEvaluations(price){ //called when item is editted or removed
 balance = balance + price;
 expense = expense - price;
displayExpense.innerHTML =`<h3 id="total-expense-display">Expenses</h3>
                                      <span id="expense-value">${expense}</span>`
displayBalance.innerHTML = `<h3 id="balance-remaining">Balance Remaining</h3><span>${balance}</span>`
}


function editItem(id) {
let detail = expenseList.find((item) => {
   return item.id === id
})
const product = detail.object
const charge = detail.price
 productTitle.value = product //enters the data in input field
 productCost.value =  charge

 calReEvaluations(charge);
 expenseList = expenseList.filter((item) => {
   return item.id !== id;
 }) 

localStorage.setItem("expenseList", JSON.stringify(expenseList))

//display the editted list 
list.innerHTML = '';
const displayList = expenseList.map((item) => {
     itemObject(item.id, item.object, item.price)
 });
}

function deleteItem(id){
const obj = expenseList.filter((item) => { //obj is array consisting of targeted object
      return item.id === id;
 })
let {price, ...rest} =  obj[0] ///extracting price and leaving out the rest
//finding out price to pass to function
calReEvaluations(price);
expenseList = expenseList.filter((item) => {
   return item.id !== id;
 })
localStorage.setItem("expenseList", JSON.stringify(expenseList))
list.innerHTML = '';
 const displayList = expenseList.map((item) => {
     itemObject(item.id, item.object, item.price)

 });
}
 
//function for pushing in array and saving in local Storage
//also forming objects
   const addProduct = (object, price) => {
     id = Math.floor(Math.random()*100).toString() 
      expenseList.push({id,object, price}); //putting object in array 
      localStorage.setItem("expenseList", JSON.stringify(expenseList)); //saving in LocalStorage
      return {id,object, price}
    }
    


//GETS EXECUTED ONLY AT THE BEGINNING
if (expenseList.length !== 0) { //calling the item append function for already existing items
    
   budgetAmount.value = JSON.parse(localStorage.getItem("budgetValue")); // setting previous value as default

   expenseList.forEach(({id,object, price}) => {
      expense = expense + parseInt(price) ; //adding the pricing of existing items
      itemObject(id,object,price);   // (or)  expenseList.forEach(itemObject);

   });
   balance = budgetAmount.value - expense;
   //display panel 

   displayBudget.innerHTML = `<h3 id="total-budget-display">Total Budget</h3><span>${budgetAmount.value}</span>`
   displayExpense.innerHTML =`<h3 id="total-expense-display">Expenses</h3>
                                      <span id="expense-value">${expense}</span>`
   displayBalance.innerHTML = `<h3 id="balance-remaining">Balance Remaining</h3><span>${balance}</span>`

} 

itemList.style.display = expenseList.length === 0 ? "none" : "flex";

//functionality of budget setting button
setBudgetBttn.addEventListener("click", ()=>{ 
   setBudget = parseInt(budgetAmount.value); //.value gives a string so we use parseInt()
   balance = setBudget; 
   if ( budgetAmount.value == "" || setBudget < 0 ) { //if empty string or negative number
     budgetError.classList.remove("hide")  
   } else { 
     budgetError.classList.add("hide")  

     if(expense !==0) { 
      balance = setBudget - expense 
     }
     displayBudget.innerHTML = `<h3 id="total-budget-display">Total Budget</h3><span>${setBudget}</span>`
     displayBalance.innerHTML = `<h3 id="balance-remaining">Balance Remaining</h3><span>${balance}</span>`
   }
      //saving budget value in localStorage
    localStorage.setItem("budgetValue", JSON.stringify(setBudget))
})

//functionality of product detail container
productBttn.addEventListener("click", () =>{
   // console.log(expenseList)
       let cost = parseInt(productCost.value);//taking the entered product cost
       let productName= productTitle.value //name of product 
      //  console.log(balance)
   if (productTitle.value == "" || productCost.value == "" || productCost < 0) { 
      productError.classList.remove("hide")
   } 
   else { 
      productError.classList.add("hide")
  
//  //calculating expense and balance
 balance = balance - cost;
 expense = expense + cost;
displayExpense.innerHTML =`<h3 id="total-expense-display">Expenses</h3>
                                      <span id="expense-value">${expense}</span>`
displayBalance.innerHTML = `<h3 id="balance-remaining">Balance Remaining</h3><span>${balance}</span>`

      var newObject = addProduct(productName,cost)
      itemObject(newObject.id, newObject.object, newObject.price); 
      //call for adding in the newer item to the rest of the list
      
   //keeping check on budget
   if(balance <= 0 ) {
      alert.classList.remove("hide") //showing alert for exceeding budget
   }
   //closing the alert message
   cross.addEventListener("click", ()=> {
      alert.classList.add("hide")
   })

   productTitle.value = "";
   productCost.value ="";
  

   }  
   }

)


 






// function editItem(e) {
//     let pdt = e.parentElement.parentElement.children[0].innerText
//     let pdtCost = e.parentElement.parentElement.children[1].innerText
//     productTitle.value = pdt ;
//     productCost.value = pdtCost;
    
//     //removing previous version form storage
//     const number = expenseList.findIndex(item => {
//       return item.object === pdt ;
//     })
//     expenseList.splice(number,1);
//     console.log(expenseList);
//    //  itemObject(...expenseList);
//     itemObject(id,object,price)
//     localStorage.setItem("expenseList", JSON.stringify(expenseList))
//   }
