const formidable = require('formidable')
const Student = require('../models/Student')
const Course = require('../models/Course')
const bcrypt = require('bcrypt')

exports.showLogin = (req,res) => {
    res.render('login')
}

//login
exports.doLogin = (req,res) => {
    //根据db中的changedPassword来判断
    //如果是false，表示用户没有更改密码，则直接和db比较password完全一致即可
    //如果是true，表示已经更改了密码，此时数据库中存储的是bcrypt加密之后的密码

    const form = formidable({multiples: true})
    form.parse(req, (err, fields) => {
        let sId = fields.sId
        let sPassword = fields.sPassword
        //检查是否有此学生
        Student.find({sId:sId}, (err, students) => {
            if(err){
                return res.send('-2') //-2 server error
            }

            if(students.length===0){
                //没有这个学生
                return res.send('0') //0 server error
            }else{
                //有这个学生
                //此学生是否修改过密码
                let changedPassword = students[0].changedPassword

                if(!changedPassword){
                    //如果没修改过密码，则比对明码
                    if(sPassword===students[0].sPassword){
                        //登录成功
                        //存储session
                        req.session.login=true
                        //记录学号
                        req.session.sId = sId
                        //记录学生姓名
                        req.session.sName = students[0].sName
                        //记录此人是否更改过密码
                        req.session.changedPassword = students[0].changedPassword
                        //记录此人年级
                        req.session.sGrade = students[0].sGrade
                        return res.send('1') //1 student exists and login successfully
                    }else{
                        //登陆失败
                        return res.send('-3') //1 student exists but login failed
                    }
                }else{
                    //如果修改过密码，则比对bcrypt密文
                    bcrypt.compare(sPassword, students[0].sPassword, (err, isMatch) => {

                        if(err){
                            return res.send('-2') //server error
                        }

                        if(isMatch){
                            //登录成功
                            //存储session
                            req.session.login=true
                            //记录学号
                            req.session.sId = sId
                            //记录学生姓名
                            req.session.sName = students[0].sName
                            //记录此人是否更改过密码
                            req.session.changedPassword = students[0].changedPassword
                            //记录此人年级
                            req.session.sGrade = students[0].sGrade
                            return res.send('1')
                        }else{
                            //登陆失败
                            return res.send('-3') //1 student exists but login failed
                        }

                    })
                }


            }

        })

    })

}

/**
 * show registration table
 */
exports.showIndex = (req,res) => {
    //登陆验证，如果session中没有login，则重定向到登陆页面
    if(!req.session.login){
        return res.redirect('/login')
    }

    //没有改过密码，必须强制跳转到更改密码页面
    if(!req.session.changedPassword){
        return res.redirect('/changePassword')
    }

    //当登陆成功并且修改过密码后再显示报名界面
    return res.render('index', {
        sId     : req.session.sId,
        sName   : req.session.sName,
        sGrade  : req.session.sGrade
    })
}

/**
 * logout
 */
exports.doLogout = (req,res) => {
    //清空session
    req.session.destroy((err) => {
        if(err){
            return res.send('-2') //-2 server error
        }
        return res.redirect('/')
    })
}

/**
 * change password page shows
 */
exports.showChangePassword = (req,res) => {
    //登陆验证，如果session中没有login，则重定向到登陆页面
    if(!req.session.login){
        return res.redirect('/login')
    }

    return res.render('changePassword', {
        sId     : req.session.sId,
        sName   : req.session.sName,
        showTip : req.session.changedPassword //是否显示提示条，没改过初始密码则显示，改过初始密码则隐藏
    })
}

/**
 * do change password
 */
exports.doChangePassword = (req,res) => {
    const form = formidable({multiples: true})

    form.parse(req,(err,fields) => {
        let newPassword = fields.newPassword
        //更改密码，加密保存
        Student.find({sId:req.session.sId}, (err, students) => {
            if(err){
                return res.send('-2') //-2 server error
            }

            students[0].changedPassword=true
            req.session.changedPassword=true
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newPassword, salt, function(err, newPasswordHash) {
                    //hash就是加密过后的密码，可以存储到数据库中了
                    if(err){
                        return res.send('-2') //-2 server error
                    }
                    students[0].sPassword=newPasswordHash
                    students[0].save().then(() => {
                        return res.send('1') //1 change password successfully
                    })
                });
            });
        })

    })
}

/**
 * check whether can register course
 * 此函数决定了index页面上按钮的形态、内容、是否可用
 */
exports.check = (req,res) => {
    //登陆验证，如果session中没有login，则重定向到登陆页面
    if(!req.session.login || !req.session.changedPassword){
        return res.redirect('/login')
    }
    let results = {}

    Student.find({sId:req.session.sId}, (err, students) => {
        let student = students[0]
        let myCourses = student.myCourses
        let sGrade = student.sGrade

        //将已经报名课程对应的星期几推入数组
        let occupiedDay=[]

        //查询所有课程
        Course.find({}, (err, courses) => {
            //遍历所有课程
            courses.forEach((item1) => {
                myCourses.forEach((item2) => {
                    if(item2===item1.cId){
                        occupiedDay.push(item1.cDayofweek)
                    }
                })

            })

            //得到此人所报名课程在星期几的数组后，进行逻辑判定
            //再次遍历所有课程，比对存入数组的课程，判断一门课能不能报名
            courses.forEach((item) => {
                if(myCourses.indexOf(item.cId) !== -1){//如果已经报名了此课程，输出"registered"
                    results[item.cId]='Registered'
                }else if(occupiedDay.indexOf(item.cDayofweek)!==-1){//如果这门课的日子被占用了
                    results[item.cId]='You have selected on this day'
                }else if(item.cNumber<=0){ //如果名额不足
                    results[item.cId]='No Remaining'
                }else if(item.cAllow.indexOf(sGrade)===-1){//如果年级不符合要求
                    results[item.cId]='Grade Not Allowed'
                }else if(myCourses.length===2) //已经报了两门课程了
                {
                    results[item.cId]='Maximum courses reached'
                }else { //可以报名
                    results[item.cId]='Register'
                }

            })
            return res.send(results)
        })

    })

}

/**
 * register courses
 */
exports.register = (req,res) => {
    //学号
    let sId = req.session.sId
    let form = formidable({multiples:true})
    form.parse(req, (err, fields) => {
        let cId = fields.cId
        //存入学生前先看有没有名额
        Course.find({cId:cId}, (err, courses) => {
            if(err){
                return res.send('-2')
            }
            if(courses.length===0){
                return res.send('0c')
            }
            if(courses[0].cNumber===0){
                //名额不足
                return res.send('0')
            }



        //将课程存入学生选课数组中
        Student.find({sId:sId}, (err, students) => {
            let student = students[0]
            if(err){
                return res.send('-2') //server error
            }
            if(students.length===0){
                return res.send('0s') //no such student
            }

            //通过以上验证后，存入数组
            student.myCourses.push(cId)
            //保存学生，之后向课程中的学生数组中添加该学生
            student.save().then(()=>{
                Course.find({cId:cId}, (err, courses) => {
                    let course = courses[0]
                    if(err){
                        return res.send('-2') //server error
                    }
                    if(courses.length===0){
                        return res.send('0c') //no such course
                    }

                    //将学生存入课程中的学生数组中
                    course.myStudents.push(sId)
                    //名额-1
                    course.cNumber--
                    course.save().then(()=>{
                        return res.send('1')//register successfully
                    })
                })
            })
        })
        })
    })
}

/**
 * cancel courses
 */
exports.cancel = (req,res) => {
    //学号
    let sId = req.session.sId
    let form = formidable({multiples:true})
    form.parse(req, (err, fields) => {
        let cId = fields.cId
        //将课程从学生选课数组中删掉
        Student.find({sId:sId}, (err, students) => {
            let student = students[0]
            if(err){
                return res.send('-2') //server error
            }
            if(students.length===0){
                return res.send('0s') //no such student
            }

            //通过以上验证后，删掉元素
            student.myCourses.pop(cId)
            //保存学生，之后向课程中的学生数组中删除该学生
            student.save().then(()=>{
                Course.find({cId:cId}, (err, courses) => {
                    let course = courses[0]
                    if(err){
                        return res.send('-2') //server error
                    }
                    if(courses.length===0){
                        return res.send('0c') //no such course
                    }
                    //将学生从课程中的学生数组中删掉
                    course.myStudents.pop(sId)
                    //名额+1
                    course.cNumber++
                    course.save().then(()=>{
                        return res.send('1')//register successfully
                    })
                })
            })
        })
    })
}