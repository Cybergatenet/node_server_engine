// const http = require('http')
// const PORT = process.env.PORT || 5000
// http.createServer((req, res) => {
//     res.write("Hello World Everyone")
//     res.end()
// }).listen(PORT, () => console.log(`Server Running on port ${PORT}`))

//  Express Server
const express = require('express')
const PATH = require('path')
const app = express()
const bodyParser = require('body-parser')
const CORS = require('cors')
const JOI = require('joi')
const BCRYPT = require('bcrypt')
const session = require('express-session');
const UUID = require('uuid')
const MULTER = require('multer')
const FS = require('fs')


const Joi = require("joi-browser");
Joi.image = require("joi-image-extension");

const {
    newPORT = 3300
} = process.env.PORT

// console.log(FS)
// console.log(UUID.v4())
const expDate = 1000 * 60 * 60 * 24 * 7 // 7 days

app.use(session({
    name: "CyberSession",
    secret: UUID.v4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: expDate,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: true // 'strict'
    }
}))

// Cors()
const cors = {
    credential: true,
    origin: "http://localhost:3000" // React server
}
app.set('trust proxy', 1) // trust first proxy

// Middlemare
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()) 

// Check User Authentication
const redirectLogin = (req, res, next) => {
    if (!req.session.userId){
        res.redirect('/login')
    }else{
        next()
        // /dashboard && /logout custom middleware
    }
}

const redirectDashboard = (req, res, next) => {
    if (req.session.userId){
        res.redirect('/dashboard')
    }else{
        next()
        // /login && /register custom middleware
    }
}
// custom middleware
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId){
        res.locals.user = users.find(
            user => user.id === userId
        )
    }
    next()
})
//  res.clearCookie(name_of_cooki)
//  return redirect('/dashboard')
//  req.sessionID


const Storage = MULTER.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = MULTER({
    storage: Storage,
}).single('testImg')

app.get('/upload', (req, res) => {
    res.send('img Upload')
})

app.post('/upload', (req,res) => {
    upload(req, res, (err) => {
        
        if(err){
            console.log(err);
        }else{
            console.log(req.body, req.file)
            res.json({data: 'success'})
            // const newImg = JOI.object().keys({
            //     testImg: string().required().only('image/png'),
            //     text: string().required().min(3)
            // })
            // const {error, value} = newImg.validate(req.body)

            // if(error){
            //     console.log(error)
            // }else{
            //     console.log("success: "+ value);
            // }


        }
    })

    // next()
})

// Custom Module
// const Greeting = require('./MODULES/User')
// const Person = require('./MODULES/Class')

// console.log(Greeting("cybergate"))

// const vincent = new Person("Cybergate", 23, 56)
// console.log(vincent.calculate())


// require('dotenv').config()
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 5000
// console.log(process.env.USER)

// ReadLine Module
// const ReadLine = require('readline')
// const { stdin, stdout } = require('process')

// const input = process.stdin
// const output = process.stdout

// [input, output] = [output, input]
// const [user, setUser] = {user: "uswer", user1: "dfuid"}
// let students = {person: "cyebrgate", person2: "vincent"}
// const {person, person2} = students
// console.log(person, person2)

// const rl = ReadLine.createInterface({input, output})
// rl.question("What is your Name? ", (answer) => {
//     console.log(`the user answered ${answer}`)
// })

// ######### FIRST READLINE APP IN NODE ############### //
// Create Readline Module
// const Naprima = require('readline')
// const { Console } = require('console')
// const rl = Naprima.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
// console.log(rl)
// Generate Random Numbers && Sum Numbers
// const num1 = Math.ceil(Math.random() * 20) // Math.floor || Math.ceil
// const num2 = Math.ceil(Math.random() * 20)
// // console.log(num1, num2)
// const answer = num1 + num2
// console.log(num1, num2, answer)

// Ask the User the question
// rl.question(`${num1} + ${num2} is Equal to: `, (response) => {
//     if(response.trim() != answer){
//         console.log(`Your answer is Wrong. The correct answer is ${answer}`)
//         rl.close()
        
//     }else{
//         console.log(`Your answer is Correct`)
//         rl.close()
//     }
//     // Give User 5 seconds to guess the answer
// })
//  check if correct && return answer


// ################# FILE SYSTEM MODULE ###############
// const FS = require('fs')

// DB Connection
const MYSQL = require('../server/MODULES/Conn')
const { json } = require('body-parser')
const multer = require('multer')
const { string } = require('joi')
1
// MYSQL.query("SHOW DATABASES", (err, result) => {
//     if (err) throw err;

//     if(result){
//         console.log(result)
//     }else{
//         console.log('No database found')
//     }
// })


// Testing Logging System
// const sql = "SELECT * FROM `users`"
// const sql2 = "INSERT INTO `users` (`user_id`, `username`, `email`, `pwd`) VALUES (NULL, 'nelson', 'nelson@email.com', MD5('123456'));"
// const sql3 = "SELECT * FROM `users` WHERE `user_id`=? OR `username`=? OR `email`=? LIMIT 1"
// const userInput = "nelson"
// const userPwd = '123456'
// MYSQL.query(sql3, [userInput, userInput, userInput], (err, result) => { // prepared statement
//     if (err) throw err

//     if(result.length > 0){
//         // console.log(result[0].username)
//         if(userPwd === result[0].pwd){
//             // Login success
//             console.log("Login Successfully")
//             // res.sendFile('')
//         }else{
//             console.log("Wrong Email/Password Combination")
//         }
//     }else{
//         console.log('User does not exist')
//     }
// })


// Serving Static Files
// Middle-ware
app.use(express.static(PATH.join(__dirname, '../public')))

// initialize Our Server
// Home Page Route
app.get('/', (request, response) => {
    // res.send('Hello world')
    response.sendFile(PATH.join(__dirname, '../public/index.html'))
})
// Login Page Route
app.get('/login', (req, res) => {
    console.log(req.session.user)
    if(!req.session.user){
        res.sendFile(PATH.join(__dirname, '../public/login.html'))
    }else{
        res.redirect('/')  // redirect to dashboard
    }
})

app.post('/login', (req, res) => {
    // res.sendFile(PATH.join(__dirname, '../public/login.html'))

    const UserSchema = JOI.object().keys({
        username: JOI.string().min(3).required(),
        pwd: JOI.string().min(6).max(8).required()
    })

    const {error, value} = UserSchema.validate(req.body)

    if(error){
        console.log(error.message)
        // res.json({msg: error.message})
    }
    if(value){
        const sql = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"

        MYSQL.query(sql, [value.username], (err, result) => {
            if (err) throw err;

            if(result.length > 0){
                BCRYPT.compare(value.pwd, result[0].pwd, (err, valid) => {
                    if(err) throw err;

                    console.log(valid, result[0].pwd, result[0].username)
                    if(!valid){
                        // res.redirect('/') // Handled in Client
                        res.json({msg: "Login Successful"})
                        // console.log("user Logged in: " ,req.session.user)
                        if(req.session.user === undefined){
                            req.session.user = result
                            console.log(req.session.user, result)
                        }else{
                            req.session.resetMaxAge()
                        }
                    }else{
                        res.json({meg: "Worng Username/Password Combination"})
                    }
                })
            }else{
                res.json({msg: "Username Does NOT Exist"})
            }
        })
    }
})


// Our Module 
// const rl = require('./MODULES/ClassWork')

// OUr Event
// const eventEmitter = require('./MODULES/EventEmmitter')

// Dynamic Routes
app.get('/example/:username/:email/:pwd', (req, res) => {
    // res.json({data: "Cybergate", login: true}) // Sample REST-API
    // res.sendStatus(500)
    // res.sendFile(PATH.join(__dirname, '../public/text.html'))
    // Params
    const user = req.params.username
    const email = req.params.email
    const pwd = req.params.pwd
    res.send(`Hello ${user}. Thank for your subscribtion. Your email[${email}] has been recorded and your new password is ${pwd}]`)
})

// Sign up Handling
app.get('/signup', (req, res) => {
    res.sendFile(PATH.join(__dirname, '../public/text.html'))
})


app.post('/signup', (req,res) => {
    // res.sendFile(PATH.join(__dirname, '../public/text.html'))
    
    // console.log(req.body)
    // const username = req.body.username
    // const email = req.body.email
    const pwd = req.body.pwd
    const cpwd = req.body.cpwd

    if(pwd === cpwd){
        // EXpress Form Validation
        const UserSchema = JOI.object().keys({
            username: JOI.string().min(3).required(),
            email: JOI.string().email().required(),
            pwd: JOI.string().min(6).max(8).required(),
            cpwd: JOI.string().min(6).max(8).required()
        })

    const {error, value} = UserSchema.validate(req.body)

        if(error){
            console.log(error.message)
        }else{
            // console.log(value)
            BCRYPT.hash(value.pwd, 10).then(pwd_hash => {
                const sql = "INSERT INTO `users` (`username`, `email`, `pwd`) VALUES (?, ?, ?);"

                MYSQL.query(sql, [value.username, value.email, pwd_hash], (err, result) => {
                    if(err) throw err;

                    if(result){
                        res.redirect('/login')
                    }
                })

            }).catch(err => console.log(err))
        }
       
    }else{
        console.log("Password Mismatch")
    }
    
})


app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))