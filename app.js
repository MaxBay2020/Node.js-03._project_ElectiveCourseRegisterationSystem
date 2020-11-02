const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoDBURI = require('./config/mongodb')
const session = require('express-session')
const adminStudentCtrl = require('./controllers/adminStudentCtrl')
const adminCourseCtrl = require('./controllers/adminCourseCtrl')
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
/***
 * admin contrller
 */
app.get     ('/admin', adminCtrl.showAdminDashboard) //admin panel shows
app.get     ('/admin/report', adminCtrl.showAdminReport) //report panel shows
/***
 * adminStudent controller
 */
app.get     ('/admin/student', adminStudentCtrl.showAdminStudent) //students panel shows
app.get     ('/admin/student/import', adminStudentCtrl.showAdminStudentImport) //import student panel shows
app.post    ('/admin/student/import', adminStudentCtrl.doAdminStudentImport) //submit form
app.get     ('/admin/student/download', adminStudentCtrl.downloadStudentsXlsx) //download all students xlsx
app.get     ('/student', adminStudentCtrl.getAllStudents)//get all students info
app.post    ('/student', adminStudentCtrl.addOneStudent) //add one student
app.delete  ('/student', adminStudentCtrl.removeSelectedStudents) //remove selected students
app.checkout('/student/:sId', adminStudentCtrl.checkStudentExists) //check whether student id exists
app.post    ('/student/:sId', adminStudentCtrl.updateOneStudent) //update student info

/***
 * adminCourse controller
 */
app.get     ('/admin/course', adminCourseCtrl.showAdminCourse) //courses management panel shows
app.get     ('/course', adminCourseCtrl.getAllCourses) //get all courses
app.get     ('/admin/course/import', adminCourseCtrl.showAdminCourseImport) //import course panel shows
app.post    ('/admin/course/import', adminCourseCtrl.doAdminCourseImport) //submit form
app.post    ('/admin/course/', adminCourseCtrl.updateOneCourse) //update course info
app.delete  ('/course', adminCourseCtrl.removeSelectedCourses) //remove selected courses
app.post    ('/course', adminCourseCtrl.addOneCourse) //remove selected courses


//error page
app.use((req,res)=>{
    res.send('hello, page not exist')
})

app.listen(3000, () => {
    console.log('server running...')
})