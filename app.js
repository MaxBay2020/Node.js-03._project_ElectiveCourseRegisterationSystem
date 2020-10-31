const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoDBURI = require('./config/mongodb')
const session = require('express-session')
const adminCtrl = require('./controllers/adminCtrl')
const expressLayouts = require('express-ejs-layouts')


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
app.use('/node_modules', express.static(__dirname+'/node_modules'))
app.set('layout','./admin/layouts/layout1')
app.use(expressLayouts)


/***
 * RESTful routes
 */
app.get('/admin', adminCtrl.showAdminDashboard) //admin panel shows
app.get('/admin/student', adminCtrl.showAdminStudent) //student panel shows
app.get('/admin/course', adminCtrl.showAdminCourse) //course panel shows
app.get('/admin/report', adminCtrl.showAdminReport) //report panel shows
app.get('/admin/student/import', adminCtrl.showAdminStudentImport) //import panel shows
app.post('/admin/student/import', adminCtrl.doAdminStudentImport) //submit form
app.get('/student', adminCtrl.getAllStudents)//get all students info
app.post('/student/:sId', adminCtrl.updateOneStudent) //update student info

//error page
app.use((req,res)=>{
    res.send('hello, page not exist')
})

app.listen(3000, () => {
    console.log('server running...')
})