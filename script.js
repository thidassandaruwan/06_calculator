const inputOutputField = document.querySelector("#input-output");
const subResultField = document.querySelector("#sub-result");
const buttonContainer = document.querySelector(".button-container");

let equation = "";
let result = "";
let numbers = [];

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
})

function handleNumber(number){
    equation += number;
}

function handleOperator(operator){
    const operators = [" + ", " - ", " x ", " / ", " % "]
    if (operator === "x²"){ 
        // if the input itn't just a number
        if (Number.isNaN(Number(equation))){ return; }

        const numEquation = Number(equation);
        equation = `${numEquation * numEquation}`;
        return;   
    }
    // operator cannot be at the begining
    if (equation === "" || operators.some((op) => equation.endsWith(op))){
        return;
    }

    equation += ` ${operator} `;
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

function calculateSquare(){
     
}

function updateDisplay(){
    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}