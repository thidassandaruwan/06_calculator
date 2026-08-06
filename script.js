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

    // limit the ammount of characters accepted per calculation
    if (equation.length >= 14){
        result = "Character Limit Reached!";
        return;
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
        // if last entered character is a operator, create a new eqation part
        if (operators.includes(equationParts[lastIndex])) { 
            equationParts.push(""); 
            lastIndex++;
        }
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
            lastIndex = 0;
            result = "";
            break;

        case "backspace":
            backSpace();
            break;

        case "calculate":
            equationParts = [result];
            lastIndex = 0;
            result = "";
            break;
            
    }
}

function calculateResult(){

    // if last input is an operator : do not calculate 
    if (operators.includes(equationParts[lastIndex])){ return; }

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
                    result = "Cannot divide by 0";
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

    // update the sub result
    result = String(total);
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
    equation = equationParts.join("");

    console.log(equation);
    
    inputOutputField.textContent = equation;
    subResultField.textContent = result;
}