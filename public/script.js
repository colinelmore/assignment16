const getFoods = async () => {
    try{
        return (await fetch("/api/foods")).json();
    } catch(error) {
        console.log(error);
    }
}

const showFoods = async () => {
    let foods = await getFoods();
    let foodsDiv = document.getElementById("food-list");
    foods.forEach((food) => {
        const section = document.createElement("section");
        foodsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        h3 = document.createElement("h3");
        h3.innerHTML = food.name;
        a.append(h3);

        a.onclick = (e) => {


            e.preventDefault();
            displayDetails(food);


            
        }
    });
};

const displayDetails = (food) => {
    const foodDetails = document.getElementById("food-details");
    foodDetails.innerHTML = " ";

    const h3 = document.createElement("h3");
    h3.innerHTML = food.name;
    foodDetails.append(h3);

    const dlink = document.createElement("a");
    dlink.innerHTML = " &#x2751";
    foodDetails.append(dlink);
    dlink.id = "delete-link"

    const elink = document.createElement("a");
    elink.innerHTML = ("&#9998;");
    foodDetails.append(elink);
    elink.id = "edit-link";

    const p = document.createElement("p");
    foodDetails.append(p);
    p.innerHTML = food.description;

    const p2 = document.createElement("p");
    foodDetails.append(p2);
    p2.innerHTML = food.review;

    const p3 = document.createElement("p");
    foodDetails.append(p3);
    p3.innerHTML = food.rating;


    const ul = document.createElement("ul");
    foodDetails.append("ul");
    food.condiments.forEach((condiment) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = condiment;
    })

elink.onclick = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Edit Description"
}

    populateEditForm(food);
}

const populateEditForm = (food) => {};

const addEditFood = async (e) => {
    e.preventDefault();

    const form = document.getElementById("add-edit-food-form");
    const formData = new FormData(form);
    formData.append("condiments", getCond());

    let response;

    if(form.id.value == -1){
        formData.delete("id");
        
        response = await fetch("/api/foods", {
            method:"POST",
            body: formData,
        });
    }


    if(response.status != 200) {
        console.log("Error");
        return;
    }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showFoods();
}; 

const getCond = () => {
    const inputs = document.querySelectorAll("#cond-boxes");
    const condiments = [];

    inputs.forEach((input)=>{
        condiments.push(input.value);
    });
    return condiments;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-food-form");
    form.reset();
    form.foodId = "-1";
    document.getElementById("rating-boxes").innerHTML = " ";
}

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Food";
}

const addCondiment = (e) => {
    e.preventDefault();
    const condBoxes = document.getElementById("cond-boxes");
    const input = document.createElement("input");
    input.type = "text";
    condBoxes.append(input);
}

const editFood = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-food-form");

    const formData = new FormData(form);
    formData.append("Condiments", getEditMaterials());
    
    let response;

       console.log("in  editFood"); 
       console.log(...formData);

       response = await fetch(`/api/food/${form.id.value}`,{
        method:"PUT",
        body:formData
       });

   if(response.status !=200){
    console.log("error");
    return;
   }

   const food = await response.json();
   
   document.querySelector(".form-class").classList.add("transparent");
   //resetForm();
   showFoods();
   edit(food);
};

const getEditMaterials = () => {
    const inputs = document.querySelectorAll("#cond-boxes input");
    let conds = [];
    inputs.forEach((input)=> {
        conds.push(input.value);
    });
    return conds;
}


window.onload = () => {
    showFoods();
    document.getElementById("add-edit-food-form").onsubmit = addEditFood;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparents");
    }

    document.getElementById("add-condiment").onclick = addCondiment;
}