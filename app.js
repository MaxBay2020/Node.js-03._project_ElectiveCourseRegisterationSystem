const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoDBURI = require('./config/mongodb')
const session = require('express-session')


//connect to mongoDB
mongoose.connect(mongoDBURI.uri, {useNewUrlParser: true, useUnifiedTopology: true})

//set up session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'SelectiveCourseRegistrationSystem',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')
app.use('/public', express.static(__dirname+'/public'))

app.get('/', (erq,res) =>{
    res.send('hello, node.js')
})

//error page
app.use((req,res)=>{
    res.send('hello, page not exist')
})

app.listen(3000, () => {
    console.log('server running...')
})