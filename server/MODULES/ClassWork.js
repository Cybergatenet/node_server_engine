// Import all module
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
// console.log(rl)
// Generate question
let num1 = Math.ceil((Math.random() * 10) + 1) 
let num2 = Math.ceil((Math.random() * 10) + 1)
// Calculate Answer
let answer = num1 + num2 
let time = 2000

// Throw Question
rl.question(`What is ${num1} + ${num2}? \n`, (response) => {
    console.log('Your answer is ', response)
    if(response.trim() == answer) {
        // Correct
        rl.close()
    }else{
        // not Correct
        rl.setPrompt('Incorrect Answer. Try Again \n')
        rl.prompt()
    }
    setTimeout(() => {
        if(response == ''){
            rl.setPrompt(`Timed Out. Answer is ${answer} \n`)
            rl.prompt()
        }else if(response.trim() == answer){
            rl.close()
        }else{
            console.log('Incorrect answer')
        }
    }, time)
})
rl.on("close", () => {
    console.log(`Your Answer is Correct`)
})
rl.on('line', (response) => {
    if(response.trim() == answer) {
        // Correct
        rl.close()
    }else{
        // not Correct
        rl.setPrompt(`Your Answer in InCorrect. Answer is ${answer} \n`)
        rl.prompt()
    }
})

// Validate answer

// End Program
module.exports.rl