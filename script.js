const inputOutputField = document.querySelector("#input-output");
const subResultField = document.querySelector("#sub-result");
const buttonContainer = document.querySelector(".button-container");

let equation = "";
let result = "";
let equationParts = [""];

const operators = ["+", "-", "x", "/", "%"];
const ERROR_MESSAGES = {
    charLimitError : "Character Limit Reached!",
    zerDivisionError : "Cannot divide by 0!",
    nanError : "ERROR",
}

buttonContainer.addEventListener("click", (event) => {
    // get the nearest element which is a button. The usual usecase is to prevent retrieveing <span> elements stored inside <button> 
    // but this also migitate clicks outside the buttons but still within the numpad
    const button = event.target.closest("button");
    if (!button){ return; }

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
    console.log(equationParts, (equationParts.length - 1));
    
})

function handleNumber(number){
    // if last entered character is a operator, create a new eqation part
    if (operators.includes(equationParts[(equationParts.length - 1)])) { 
        equationParts.push(""); 
        
    }

    // limit the ammount of characters accepted per calculation
    if (equation.length >= 14){
        result = ERROR_MESSAGES.charLimitError;
        return;
    }
    // add the new character to the last number of the eqation part.
    equationParts[(equationParts.length - 1)] += number;
    
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
        // if last entered character is a operator, create a new eqation part
        if (operators.includes(equationParts[(equationParts.length - 1)])) { 
            equationParts.push("");    
        }
        // one number can have only one .
        if (equationParts[(equationParts.length - 1)].includes(".")){ return; }

        equationParts[(equationParts.length - 1)] += operator;
        return;
    }

    // operator cannot be at the begining or cannot be included twice contiguisly
    if (equation === ""){
        return;
    }

    // swap operators if last character is an operator
    if (operators.includes(equationParts[(equationParts.length - 1)])){
        equationParts[(equationParts.length - 1)] = operator;
        return;
    }


    equationParts.push(`${operator}`);
    
}

function handleAction(action){
    switch (action){
        case "clear-all":
            equationParts = [""];
            result = "";
            break;

        case "backspace":
            backSpace();
            break;

        case "calculate":
            // prevent error messages copying from result to Main text
            if (result && !Object.values(ERROR_MESSAGES).includes(result)) {
                equationParts = [result];
                lastIndex = 0;
                result = "";
            }
            break;
            
    }
}

function calculateResult(){
    // if last input is an operator : do not calculate 
    if (operators.includes(equationParts[(equationParts.length - 1)])){ return; }

    /// if eqation has only one number : do not calculate
    if (equationParts.length === 1){ return; }

    let total = Number(equationParts[0]);
    // caculate the value
    for (let i = 1; i < (equationParts.length - 1); i += 2){ 
        const currentOperator = equationParts[i];
        const nextNumber = Number(equationParts[i + 1]);
        switch (currentOperator){
            case "+":
                total += nextNumber;
                break;
            case "-":
                total -= nextNumber;
                break;
            case "x":
                total *= nextNumber;
                break;
            case "/":
                if(nextNumber === 0){
                    result = ERROR_MESSAGES.zerDivisionError;
                    return;
                }
                total /= nextNumber;
                break;
            case "%":
                total %= nextNumber;
                break;
        }
    }

    // limit the result to only have 5 decimal places
    total = Number(total.toFixed(5));

    if (isNaN(total)){
        result = ERROR_MESSAGES.nanError;
    }
    else{
        // update the sub result
        result = String(total);
    }    
    console.log(total);
    
}

function backSpace(){
    // remove the character in the end
    equationParts[(equationParts.length - 1)] = equationParts[(equationParts.length - 1)].slice(0, -1);

    // if the equation is empty, do nothing.
    if (equationParts.length === 1 && equationParts[(equationParts.length - 1)] === ""){ return; }
    
    // if the last eqation part is empty, remove that part
    if (equationParts[(equationParts.length - 1)] === "")
    {
        equationParts.pop();
        
    }

    // if equations has only 2 parts (which means it only has number and operator), make the result = ""
    if (equationParts.length < 3){ 
        result = ""; 
    }
    else{
        calculateResult();
    }
    
}

function updateDisplay(){
    equation = equationParts.join("");

    console.log(equation);
    
    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}