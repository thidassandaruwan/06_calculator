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
    formatError : "Format Error",
}

buttonContainer.addEventListener("click", (event) => {
    // get the nearest element which is a button. The usual usecase is to prevent retrieveing <span> elements stored inside <button> 
    // but this also migitate clicks outside the buttons but still within the numpad
    const button = event.target.closest("button");
    if (!button){ return; }

    const { num, op, action } = button.dataset;

    // if number or operator is clicked, check for character limit
    if ((num || op) && (equation.length >= 15)){
        result = ERROR_MESSAGES.charLimitError;
        updateDisplay();
        return;
    }

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
    console.log(`Parts: ${equationParts}, lastIndex : ${(equationParts.length - 1)}`);
    
})

function handleNumber(number){
    // if last entered character is a operator, create a new eqation part
    if (operators.includes(getLastEquationPart())) { 
        equationParts.push(""); 
        
    }

    // add the new character to the last number of the eqation part.
    equationParts[equationParts.length - 1] += number;
    
    calculateResult()
}

function handleOperator(operator){  
    if (operator === "x²"){ 
        // Only allow squaring if the equation is a single number (the number cannot be empty of be just a ".")
        if (equationParts.length !== 1 || equationParts[0] === "" || equationParts[0] === ".") return;

        const numEquation = Number(equation);
        equationParts = [`${numEquation * numEquation}`];
        return;   
    }

    // if the operator is . operator
    if(operator === "."){
        // if last entered character is a operator, create a new eqation part
        if (operators.includes(getLastEquationPart())) { 
            equationParts.push("");    
        }
        // one number can have only one .
        if (getLastEquationPart().includes(".")){ return; }

        equationParts[equationParts.length - 1] += operator;
        return;
    }

    // operator cannot be at the begining or cannot be included twice contiguisly
    if (equation === ""){
        return;
    }

    // swap operators if last character is an operator
    if (operators.includes(getLastEquationPart())){
        equationParts[equationParts.length - 1] = operator;
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
            calculateResult();
            // prevent error messages copying from result to Main text
            if (result && !Object.values(ERROR_MESSAGES).includes(result)) {
                equationParts = [result];
                result = "";
            }
            break;     
    }
}

function calculateResult(){
    // get the valid parts of the eqation (this removes opeartors at the end)
    const validParts = (operators.includes(getLastEquationPart()))? equationParts.slice(0, -1) : equationParts;

    /// if eqation need to have at least 3 parts
    if (validParts.length < 3){
        result = ""
        return; 
    }

    let total = Number(validParts[0]);
    // caculate the value
    for (let i = 1; i < (validParts.length - 1); i += 2){ 
        const currentOperator = validParts[i];
        const nextNumber = Number(validParts[i + 1]);
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
        result = ERROR_MESSAGES.formatError;
    }
    else{
        // update the sub result
        result = String(total);
    }    
    
}

function backSpace(){
    // remove the character in the end
    equationParts[equationParts.length - 1] = equationParts[equationParts.length - 1].slice(0, -1);

    // if the eqation has more than one part and last part is empty
    if (getLastEquationPart() === "" && equationParts.length > 1){
        equationParts.pop();
    }
    
    calculateResult();
}

function updateDisplay(){
    equation = equationParts.join("");
    
    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}

function getLastEquationPart(){ return equationParts[equationParts.length - 1];}