const mongoose = require('mongoose')

const { Schema } = mongoose

const studentSchema = new Schema({
    'sId'               : String,
    'sName'             : String,
    'sGrade'            : String,
    'sPassword'         : String,
    'changedPassword'   : {type: Boolean, default: false},
    'myCourses'         :[String]
})

/*import into db*/
studentSchema.statics.importStudents = function(workSheetsFromFile){
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_"
    //存学生前要先删除集合
    Student.remove({}, () => {
        console.log('remove done')
    })

    //存储数据
    for (let i = 0; i < 6; i++) {
        for (let j = 1; j < workSheetsFromFile[i].data.length; j++) {
            //这个人的6位明文密码
            let password = ''
            for (let k = 0; k < 6; k++) {
                password+=str.charAt(parseInt(str.length*Math.random()))
            }

            let s = new Student({
                'sId': workSheetsFromFile[i].data[j][0], //studentID
                'sName': workSheetsFromFile[i].data[j][1], //student name
                'sGrade': workSheetsFromFile[i].name, //student grade
                'sPassword': password
            })
            s.save().then(()=>{
                console.log('save complete')
            })

        }

    }
}

const Student = mongoose.model('Student', studentSchema)

module.exports = Student