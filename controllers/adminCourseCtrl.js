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
        page: 'course'
    })
}

/**
 * show course import page
 */
exports.showAdminCourseImport = (req,res) => {
    res.render('admin/course/import', {
        page: 'course'
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
                        'page': 'course',
                        'tip': 'Oops! Uploaded failed'
                    })
                }

                return res.render('admin/partials/errorPage', {
                    'page': 'course',
                    'tip': 'Upload successfully. You have insert '+data.length+' courses into database.'
                })
            })
        })
    })
}