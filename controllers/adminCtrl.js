const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const xlsx = require('node-xlsx')
const Student = require('../models/Student')
const dateFormat = require('date-format')


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
            res.render('admin/partials/errorPage', {
                'page': 'student',
                'tip': 'Sorry, the type of uploaded file is incorrect'
            })

            //删除这个错误文件
            fs.unlink('./'+files.studentExcel.path, (err) => {
                if(err){
                    return console.log('delete failed')
                }
                console.log('Your file has been deleted from the server')
            })
            return
        }
        //read excel file
        const workSheetsFromFile = xlsx.parse('./'+files.studentExcel.path);
        //子表是否齐全，应该是6个子表
        if(workSheetsFromFile.length !== 6){
            return res.render('admin/partials/errorPage', {
                'page': 'student',
                'tip': 'The excel file lacks of sub-forms'
            })
            // return res.send('The excel file lacks of sub-forms')
        }
        //每个表格的表头是否符合要求
        for (let i = 0; i < 6; i++) {
            if(workSheetsFromFile[i].data[0][0]!=='学号' ||
                workSheetsFromFile[i].data[0][1]!=='姓名'
            ){
                return res.render('admin/partials/errorPage', {
                    'page': 'student',
                    'tip': 'The format of sub-form '+(i+1)+' is incorrect. Please make sure there are studentId, studentName on the top of each sub-form'
                })
            }
        }

        //此时，文件是合法的，命令mongoose，将数据存储到db中
        Student.importStudents(workSheetsFromFile)
        return res.render('admin/partials/errorPage', {
            'page': 'student',
            'tip': 'Upload successfully'
        })

    })
}

//load all students to list
exports.getAllStudents = (req,res)=>{
    let keywordSName = req.query.keywordSName
    let findFilter = {}

    //根据是否有查询字符串判断
    if(keywordSName !== undefined && keywordSName!==''){
        //有查询字符串时
        //用正则构造函数，将字符串转成正则对象
        let regexpSName= new RegExp(keywordSName, 'gi')
        //过滤条件
        findFilter = {
            $or: [
                {sName: regexpSName}
            ]
        }
    }

    Student.find(findFilter, (err, students) =>{
        res.send(students)
    })
}

exports.updateOneStudent = (req,res) =>{
    let sId = req.params.sId
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true });
    form.parse(req, (err, fields) => {
        if(err){
            return res.send('0')
        }
        Student.find({sId:sId}, (err,students) => {
            if(err){
                return res.send('-2') //-2 server error
            }else if(students.length!==1){
                return res.send('-1') //-1 no such student
            }
            students[0].sName = fields.sName
            students[0].sGrade = fields.sGrade
            students[0].save().then(()=>{
                return res.send('1') //1 update successfully
            })
        })

    })
}

//add student
exports.addOneStudent = (req,res) => {
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true })
    form.parse(req, (err, fields) => {
        if(err){
            return res.send('-2') //-1 server error
        }
        //验证sId是否合法
        Student.find({sId:fields.sId}, (err, students) => {
            if(err){
                return res.send('-2') //-2 server error
            }
            if(students.length===0){
                return res.send('-1') //-1 no such student
            }else{
                return res.send('1') //1 student exists
            }

        })

        let student = new Student({
            sId: fields.sId,
            sName: fields.sName,
            sGrade: fields.sGrade,
            sPassword:fields.sPassword
        })

        student.save((err) => {
            if(err){
                return res.send('-2') //-1 server error
            }

            return res.send('1') //1 add successfully
        })
    })
}

//check whether studentID exists
exports.checkStudentExists = (req,res) => {
    Student.find({sId:req.params.sId}, (err, students) => {
        if(err){
            return res.send('-2') //-2 server error
        }
        if(students.length===0){
            return res.send('-1') //-1 no such student
        }else{
            return res.send('1') //1 student exists
        }

    })
}

//remove selected students
exports.removeSelectedStudents = (req,res) => {
    const form = formidable({ multiples: true, uploadDir: './uploads', keepExtensions: true })
    form.parse(req, (err, fields) => {
        if(fields.sIds===undefined){
            //没有条目被选中
            return res.send('-1') //-1 no students selected
        }
        Student.remove({sId:fields.sIds}, (err) => {
            if(err){
                return res.send('-2') //-2 server error
            }
            return res.send('1') //1 delete successfully
        })
    })
}

//download all students excel file
let outputUrl = './public/downloads/'
let fileName = dateFormat('StudentsList-yyyy-MM-dd-hh_mm_ss_SSS', new Date())+'.xlsx';
exports.downloadStudentsXlsx = (req,res)=>{
    let tableR = [] //整个excel文件，包含子表sheetR
    let gradeArr = ['M1', 'M2', 'M3', 'H1', 'H2', 'H3']
    var sheetR = [] //excel文件中的每一饿子表

    //使用迭代器，将异步函数变成同步函数
    //i为0,1,2,...表示读取M1, M2, ..., H3
    function iterator(i){
        //当迭代到6时，停止迭代
        if(i===gradeArr.length){
            //此时，excel中已经是排序好的文件了，写入文件
            let buffer = xlsx.build(tableR)
            fs.writeFile(outputUrl + fileName, buffer, (err) => {
                if(err){
                    return res.send('-1')
                }
                //向前端发送文件在服务器上的url地址
                return res.send('/public/downloads/'+fileName)


            })
            return
        }
        //整理数据
        Student.find({sGrade: gradeArr[i]}, (err, students) => {
            students.forEach((item) => {
                sheetR.push([
                    item.sId,
                    item.sName,
                    item.sGrade,
                    item.sPasswrod
                ])
            })

            tableR.push({name: gradeArr[i], data: sheetR})

            //进行下一次迭代
            i++
            iterator(i)
            // //write file
            // fs.writeFile('./exports/students.xlsx', buffer, (err) => {
            //     if(err){
            //         return
            //     }
            //     console.log(123)
            // })
        })
    }
    //调用迭代器
    iterator(0)

}