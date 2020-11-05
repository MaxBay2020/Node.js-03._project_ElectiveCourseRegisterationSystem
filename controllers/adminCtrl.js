const formidable = require('formidable')

exports.checkLogin = (req,res,next)=>{
    if(!req.session.login || req.session.role!=='admin'){
        return res.redirect('/admin/login')
    }
    next()
}


exports.showAdminDashboard = (req,res) => {
    if(!req.session.login || req.session.role!=='admin'){
        return res.redirect('/admin/login')
    }

    res.render('./admin/student', {
        page: 'Student',
        roleName: req.session.role
    })
}


exports.showAdminReport = (req,res)=>{
    res.render('./admin/report', {
        page:'Report',
        // report: 'reportStudents',
        roleName: req.session.role
    })
}

exports.showLogin=(req,res) => [
    res.render('./admin/login')
]

exports.doLogin = (req,res) => {
    //根据db中的changedPassword来判断
    //如果是false，表示用户没有更改密码，则直接和db比较password完全一致即可
    //如果是true，表示已经更改了密码，此时数据库中存储的是bcrypt加密之后的密码
    const form = formidable({multiples: true})
    form.parse(req, (err, fields) => {
        let aUsername = fields.aUsername
        let aPassword = fields.aPassword

        if(aUsername==='admin' && aPassword==='admin'){
            req.session.login=true
            req.session.role='admin'
            res.send('1')
        }else{
            res.send('-2')
        }
    })

}


exports.logout=(req,res) => {
    console.log(1)
    req.session.destroy((err) =>{
        if(err){
            return res.send('-2') //server error
        }
        return res.redirect('/admin/login')
    })
}

exports.showAdminCoursesReport=(req,res) => {
    res.render('./admin/report', {
        page:'Report',
        // report: 'reportStudents',
        roleName: req.session.role
    })
}