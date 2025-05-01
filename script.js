// currency api used: "https://github.com/fawazahmed0/exchange-api"

const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

//populating the dropdown boxes
const dropdowns = document.querySelectorAll(".dropdown select");
const convertButton = document.querySelector("#convert-btn");
const exchangeButton = document.querySelector(".exchange-container button");
const amnt = document.querySelector("#amount");
const fromCurr = document.querySelector("#from");
const toCurr = document.querySelector("#to");
const msg = document.querySelector(".form-row p");
const exchangeRate = document.querySelector("#exchange-rate");


const updateFlag = (selectElement) =>{
    let selectOption = selectElement.options[selectElement.selectedIndex]; //get the current option
    let flagCode = selectOption.dataset.flag;
    let img = selectElement.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${flagCode}/flat/48.png`;
}

const convertCurr = async () =>{
    const amntVal = parseFloat(amnt.value);
    // checking for a) if empty input, b) if not a number (e.g. string) OR c) if negative number
    if(!amntVal || isNaN(amntVal) || Number(amntVal) <= 0){
        alert("Enter valid amount!");
        return;
    }
    const toVal = toCurr.value.toLowerCase();
    const fromVal = fromCurr.value.toLowerCase();
    let url = `${BASE_URL}/${fromVal}.min.json`;
    try{
        let response = await fetch(url);
        let data = await response.json();
        let currRate = parseFloat(data[fromVal][toVal]);
        let res = amntVal*currRate;
        msg.style.visibility = "visible";
        msg.innerText = `${amntVal} ${fromVal.toUpperCase()} = ${res.toFixed(7)} ${toVal.toUpperCase()}`;
        if(amntVal>1){
            exchangeRate.style.visibility = "visible";    
            exchangeRate.innerText = ` 1 ${fromVal.toUpperCase()} = ${currRate} ${toVal.toUpperCase()}`;
        }


    }catch (error) {
        console.log(`Error: ${error}`);
    }
    
}

const swapCurr = () =>{
    let fromVal = fromCurr.value;
    let toVal = toCurr.value;
    //swapping
    let temp = fromVal;
    fromVal = toVal;
    toVal = temp;

    fromCurr.value = fromVal;
    updateFlag(fromCurr);
    toCurr.value = toVal;
    updateFlag(toCurr);
}

for(let select of dropdowns){
    for(let currency in countryList){
        let option = document.createElement("option");
        option.innerText = `${currency} - ${countryList[currency].country}`;
        //'dataset' attribute helps store additional data for an element
        option.dataset.flag = countryList[currency].flag; //this stores flag value under "flag" in option's dataset
        option.value = currency;
        select.append(option);
        if(select.name === 'from' && currency === 'USD'){
            option.selected = true;
        }
        else if(select.name === 'to' && currency === 'INR'){
            option.selected = true;
        }
    }

    // each <select> given a 'name' and 'value' will be the selected option's value
    select.addEventListener("change",(event) =>{
        updateFlag(event.target); //to idenitfy which select called (via its name)
        
    })
}

convertButton.addEventListener("click",(event) =>{
    event.preventDefault(); //it prevents the default action of an element. In this case, prevent form submission and page reload.
    convertCurr();
    
});

exchangeButton.addEventListener("click", (event)=>{
    event.preventDefault();
    swapCurr();
})
