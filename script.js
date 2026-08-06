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
    calculateResult()
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
            equationParts = [""]
            result = "";
            break;

        case "backspace":
            backSpace();
            break;

        case "calculate":
            calculateResult(); //////////////////////////////////////////////// not necessary but check at the end
            equation = result;
            result = "";
            break;
            
    }
}

function calculateResult(){
    // check the eqation format
        // if ends with operator

    // calculate the result

    // update the sub result
}

function backSpace(){
    // remove the character in the end
    equationParts[lastIndex] = equationParts[lastIndex].slice(0, -1);

    // if the equation is empty, do nothing.
    if (equationParts.length === 1 && equationParts[lastIndex] === ""){ return; }
    // if the last eqation part is empty, remove that part
    else if (equationParts[lastIndex] === "")
    {
        equationParts.pop();
        lastIndex--;
    }
    calculateResult();
}

function updateDisplay(){
    equation = equationParts.reduce((eqationString, part) => {
        return eqationString += part;
    }, "");

    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}