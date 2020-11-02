const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const Course = require('../models/Course')
// const mongoose = require('mongoose')

/**
 * show course panel
 */
exports.showAdminCourse = (req,res) => {
    res.render('admin/course', {
        page: 'Courses'
    })
}

/**
 * show course import page
 */
exports.showAdminCourseImport = (req,res) => {
    res.render('admin/course/import', {
        page: 'Courses'
    })
}

/***
 *import json data into db
 */
exports.doAdminCourseImport = (req,res) => {
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true });
    form.parse(req, (err, fields, files) => {
        //get this file
        fs.readFile(files.courseJson.path, (err, data) => {
            //入库前，先清空集合
            Course.remove({}, () => {
                console.log('remove done')
            })

            let uploadedCourses = JSON.parse(data.toString())
            Course.insertMany(uploadedCourses.courses, (err, data) => {
                if(err){
                    return res.render('admin/partials/errorPage', {
                        'page': 'Courses',
                        'tip': 'Oops! Uploaded failed'
                    })
                }

                return res.render('admin/partials/errorPage', {
                    'page': 'Courses',
                    'tip': 'Upload successfully. You have insert '+data.length+' courses into database.'
                })
            })
        })
    })
}

//load all courses to list
exports.getAllCourses = (req,res)=>{
    let keywords = req.query.keywords
    let findFilter = {}

    //根据是否有查询字符串判断
    if(keywords !== undefined && keywords!==''){
        //有查询字符串时
        //用正则构造函数，将字符串转成正则对象
        let regexp= new RegExp(keywords, 'gi')
        //过滤条件
        findFilter = {
            $or: [
                {cId: regexp},
                {cDayofweek: regexp},
                {cName: regexp},
                {cTeacher: regexp},
                {cBriefintro: regexp}
            ]
        }
    }

    Course.find(findFilter, (err, courses) =>{
        res.send(courses)
    })
}

/**
 * update one course
 */
exports.updateOneCourse = (req,res) =>{
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true });
    form.parse(req, (err, fields) => {
        if(err){
            return res.send('0')
        }
        console.log(typeof fields.cAllow)

        Course.find({cId:fields.cId}, (err,courses) => {
            if(err){
                return res.send('-2') //-2 server error
            }else if(courses.length!==1){
                return res.send('-1') //-1 no such course
            }

            courses[0].cName = fields.cName
            courses[0].cDayofweek = fields.cDayofweek
            courses[0].cNumber = fields.cNumber
            courses[0].cAllow = fields.cAllow.split(',')
            console.log(fields.cAllow.split(','))
            courses[0].cTeacher = fields.cTeacher
            courses[0].cBriefintro = fields.cBriefintro

            courses[0].save().then(()=>{
                return res.send('1') //1 update successfully
            })
        })

    })
}

/**
 * remove selected courses
 */
exports.removeSelectedCourses = (req,res) => {
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true })
    form.parse(req, (err, fields) => {
        if(fields.cIds===undefined){
            //没有条目被选中
            return res.send('-1') //-1 no courses selected
        }
        Course.remove({cId:fields.cIds}, (err) => {
            if(err){
                return res.send('-2') //-2 server error
            }
            return res.send('1') //1 delete successfully
        })
    })
}

//add course
exports.addOneCourse = (req,res) => {
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true })
    form.parse(req, (err, fields) => {
        if(err){
            return res.send('-2') //-1 server error
        }
        //验证sId是否合法
        Course.find({cId:fields.cId}, (err, students) => {
            if(err){
                return res.send('-2') //-2 server error
            }

            if(students.length===0){
                let course = new Course({
                    cId: fields.cId,
                    cName: fields.cName,
                    cDayofweek: fields.cDayofweek,
                    cNumber:fields.cNumber,
                    cAllow:fields.cAllow,
                    cTeacher:fields.cTeacher,
                    cBriefintro:fields.cBriefintro,
                })
                console.log(course)

                course.save((err) => {
                    if(err){
                        return res.send('-2') //-1 server error
                    }

                    return res.send('0') //0 no such course
                })

            }else{
                return res.send('1') //1 course exists
            }

        })


    })
}