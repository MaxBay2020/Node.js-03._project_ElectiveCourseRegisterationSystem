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