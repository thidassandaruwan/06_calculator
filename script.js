const inputOutputField = document.querySelector("#input-output");
const subResultField = document.querySelector("#sub-result");
const buttonContainer = document.querySelector(".button-container");

let equation = "";
let result = "";
let equationParts = [""];
let lastIndex = 0;

const operators = ["+", "-", "x", "/", "%"];

buttonContainer.addEventListener("click", (event) => {
    const button = event.target;

    const { num, op, action } = button.dataset;
    if(num){
        handleNumber(num)
    }
    else if(op){
        handleOperator(op)
    }
    else if(action){
        handleAction(action)
    }

    // update the display
    updateDisplay();
    console.log(equationParts, lastIndex);
    
})

function handleNumber(number){
    // if last entered character is a operator, create a new eqation part
    if (operators.includes(equationParts[lastIndex])) { 
        equationParts.push(""); 
        lastIndex++;
    }

    // add the new character to the last number of the eqation part.
    equationParts[lastIndex] += number;
}

function handleOperator(operator){  
    if (operator === "x²"){ 
        // if the input itn't just a number
        if (Number.isNaN(Number(equation))){ return; }

        const numEquation = Number(equation);
        equationParts = [`${numEquation * numEquation}`];
        return;   
    }

    // if the operator is . operator
    if(operator === "."){
        // one number can have only one .
        if (equationParts[lastIndex].includes(".")){ return; }
        equationParts[lastIndex] += operator;
        return;
    }

    // operator cannot be at the begining or cannot be included twice contiguisly
    if (equation === "" || operators.some((op) => equationParts[lastIndex] === op)){
        return;
    }


    equationParts.push(`${operator}`);
    lastIndex++;
}

function handleAction(action){
    switch (action){
        case "clear-all":
            equation = "";
            result = "";
            break;

        case "backspace":
            equation = equation.slice(0, -1);
            calculteResult();
            break;

        case "calculate":
            calculteResult();
            equation = result;
            result = "";
            break;
            
    }
}

function calculteResult(){
    // calculate the result

    // update the sub result
}

function updateDisplay(){
    equation = equationParts.reduce((eqationString, part) => {
        return eqationString += part;
    }, "");

    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}