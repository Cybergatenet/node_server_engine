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
const MAILER = require('nodemailer')
require('dotenv').config()
const TWILIO = require('twilio')(process.env.TWILIO_API, process.env.TWILIO_TOKEN)
// const { PORT = 3300 } = process.env.PORT 
const PORT = 3300 

const number = process.env.TWILIO_NUMBER

// console.log(TWILIO)
// ####### SEND SMS
app.get("/sms", (req, res) => {
    TWILIO.messages.create({
        body: "This is a test msg",
        to: '+2347037757724',
        from: number
    }).then(data => {
        console.log("sms sent: ",data)
    }).catch((err) => console.log("ERROR: ", err))

    res.send("<h2>Send SMS Node</h2>")
})

app.get("/email", (req, res) => {
    
    // const transport = MAILER.createTransport({
    //     host: 'smtp.gmail.com',
    //     user: 'abelchinedu2@gmail.com',
    //     pass: process.env.GMAIL
    // })
    
    // transport.sendMail({
    //     from: "abelchinedu2@gmail.com",
    //     to: "cybergatenet@yahoo.com",
    //     subject: "Welcome to NodeMailer",
    //     text: 'Hi, this  is my first Email to you',
    //     html: `<h3>Working well</h3>`
    // }, (err) => {
    //     console.log("Error: ", err)
    // })
    // res.send("<h2>Send Email</h2>")

    // #############################################
    // const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    // // Generate test SMTP service account from ethereal.email
    // // Only needed if you don't have a real mail account for testing
    // let testAccount = await MAILER.createTestAccount();

    // // create reusable transporter object using the default SMTP transport
    // let transporter = MAILER.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    //     },
    // });

    // // send mail with defined transport object
    // let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "abelchinedu2@gmail.com", // list of receivers
    //     subject: "Hello ✔ from Node", // Subject line
    //     text: "Hello EveryONe", // plain text body
    //     html: "<b>Thanks for subscribing</b>", // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", MAILER.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // }

    // main().catch(console.error);

    // ##########################################
    
var transporter = MAILER.createTransport({
    service: 'gmail',
    auth: {
      user: 'anabelledemo2007@gmail.com',
      pass: "@123Anabel"
    }
  });
  
  var mailOptions = {
    from: 'abelchinedu2@gmail.com',
    to: 'vincentadims@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy! can use attachment'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
})

const Storage = MULTER.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    } 
})

const upload = MULTER({
    storage: Storage
}).single('testImg')


app.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log(req.file)
            res.json({data: 'success'})
        }
    })
})

// Cookie start here
const expDate = 1000 * 60 * 60 * 24 * 7 // 7 days

//  All middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()) 

// app.use(cookieParser())

// app.use(CORS({
//     origin: ['http://localhost:3300'],
//     credentials: true,
//     methods: ["GET", "POST"]
// }))

// Axiox.defaults.withcredrials = true;

// Session Middleware
app.use(session({
    name: "CyberSession",
    secret: UUID.v4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: expDate,
        secure: process.env.NODE_ENV === "production",
        sameSite: true // 'strict'
    }
}))

// DB Collections
const User = [
    {id:1, username: "cybergate", email: "cybergate@gmail.com",pwd: '123456'},
    {id:2, username: "adaobi", email: "adaobi@gmail.com", pwd: '123456'}
];

//  Custom Middleware 
const UserLoggedIn = (req, res, next) => {
    if(req.session.user){
        // redirect To dashboard
        res.redirect('/dashboard')
    }else{
        next()
    }
}

const UserOut = (req, res, next) => {
    if(!req.session.user){
        // redirect To dashboard
        res.redirect('/login')
    }else{
        next()
    }
}
//  Custom middleware
app.use((req, res, next) => {
    const { user } = req.session
    user ? res.locals.user = User.find(u => u == user) : next()

    // next()
})

app.get('/', (req, res) => {
    const { user } = req.session
    res.send(`<h1>Hello Page</h1>
    ${user ? `<a href="/dashboard">Dashboard</a>
        
        <form method="POST" action="/logout">
            <a href="/logout">Logout</a>
        </form>`
        :
        `<a href="/login">Login</a>
        <a href="/register">Register</a>`
    }        
    `);
})

app.post('/login', UserLoggedIn, (req, res) => {
    const { username, pwd } = req.body 
    //  authencation
    if(username && pwd){ // Validation | JOI
        const user = User.find(user => username == user.username && pwd == user.pwd)

        // const { user } = res.locals

        // console.log(user)

        if(user){
            req.session.user = user.id
            // console.log(req.session.user)
            return res.redirect('/dashboard')
        }
    }
    res.redirect('/login')
})

app.get('/login',UserLoggedIn, (req,res) => {
    res.send(`<legend>User Login</legend>
    <div style="color: red;" id="output"></div>
    <form method="POST" action="/login">
        <div>
            <label for="">username</label>
            <input name="username" id="username" type="text" placeholder="Enter Username">
        </div>
        <div>
            <label for="">Password</label>
            <input name="pwd" type="password" id="pwd" placeholder="Enter Password">
        </div>
        <button type="submit" id="btn">Sign In Here</button>
    </form>
    <a href="/register">Register</a>
</fieldset>`);

})

// Register

app.get('/register', UserLoggedIn, (req,res) => {
    res.send(`<legend>User Login</legend>
    <div style="color: red;" id="output"></div>
    <form method="POST" enctype="multipart/form-data">
        <div>
            <label for="">username</label>
            <input name="username" id="username" type="text" placeholder="Enter Username">
        </div>
        <div>
            <label for="">username</label>
            <input name="email" id="username" type="text" placeholder="Enter Email">
        </div>
        <div>
            <label for="">Password</label>
            <input name="pwd" type="password" id="pwd" placeholder="Enter Password">
        </div>
        <button type="submit" id="btn">Create Account</button>
    </form>
    <a href="/login">Login</a>
</fieldset>`);

})

app.post('/register', UserLoggedIn, (req, res) => {
    const { username, email, pwd } = req.body 

    const userExist = User.some(user => username == user.username || email == user.email)

    if(!userExist){ // Check if user exist in DB
        const newUser = {
            id: User.length + 1,
            username,
            email,
            pwd
        }
        // res.send("New user added")

        User.push(newUser)

        req.session.user = newUser.id
        // console.log(User.push(newUser))
        return res.redirect('/dashboard')
    }

    res.redirect('/register')
})

// Dashboard
app.get('/dashboard', UserOut, (req, res) => {
    const userId = req.session.user
    // console.log(req.session, userId)

    const user = User.find(user => userId == user.id)
    res.send(`<h2>Welcome To Our Dashboard</h2><br>
        <h3>Name: ${user.username}</h3>
        <h4>Email: ${user.email}</h4>

        <a href="/">Home Page</a>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>
    `)
})

app.post('/logout', UserOut, (req,res) => {
    // destroy session && Clear cookies
    req.session.destroy((err) => {
        if(err){
            return res.redirect('/dasboard')
        }else{
            res.clearCookie("CyberSession")
            return res.redirect('/login')
        }
    })
    
})


app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
