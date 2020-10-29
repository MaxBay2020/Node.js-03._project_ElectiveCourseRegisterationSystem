const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const xlsx = require('node-xlsx')
const Student = require('../models/Student')


exports.showAdminDashboard = (req,res) => {
    res.render('./admin/index', {
        page: 'index'
    })
}
/*student panel controllers start*/
exports.showAdminStudent = (req,res)=>{
    res.render('./admin/student', {
        page:'student'
    })
}

exports.showAdminStudentImport = (req,res)=>{
    res.render('./admin/student/studentImport', {
        page:'student'
    })
}

exports.showAdminStudentExport = (req,res)=>{
    res.render('./admin/student/studentExport', {
        page:'student'
    })
}
/*student panel controllers end*/

exports.showAdminCourse = (req,res)=>{
    res.render('./admin/student', {
        page:'course'
    })
}

exports.showAdminReport = (req,res)=>{
    res.render('./admin/student', {
        page:'report'
    })
}

exports.doAdminStudentImport = (req,res)=>{
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true });
    form.parse(req, (err, fields, files) => {
        //检查扩展名是不是为xlsx
        if(path.extname(files.studentExcel.name) !== '.xlsx'){
            res.send('Sorry, the type of uploaded file is incorrect')
            //删除这个错误文件
            fs.unlink('./'+files.studentExcel.path, (err) => {
                if(err){
                    return console.log('delete failed')
                }
                return console.log('Your file has been deleted from the server')
            })
        }
        //read excel file
        const workSheetsFromFile = xlsx.parse('./'+files.studentExcel.path);
        //子表是否齐全，应该是6个子表
        if(workSheetsFromFile.length !== 6){
            return res.send('The excel file lacks of sub-forms')
        }
        //每个表格的表头是否符合要求
        for (let i = 0; i < 6; i++) {
            if(workSheetsFromFile[i].data[0][0]!=='学号' ||
                workSheetsFromFile[i].data[0][1]!=='姓名'
            ){
                return res.send('The format of sub-form '+(i+1)+' is incorrect. Please make sure there are studentId, studentName on the top of each sub-form')
            }
        }

        //此时，文件是合法的，命令mongoose，将数据存储到db中
        Student.importStudents(workSheetsFromFile)
        res.send('Upload successfully')

    })
}
