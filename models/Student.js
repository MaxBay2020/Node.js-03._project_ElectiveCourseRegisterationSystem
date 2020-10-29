const mongoose = require('mongoose')

const { Schema } = mongoose

const studentSchema = new Schema({
    'sId': String,
    'sName': String,
    'sGrade': Number
})

/*import into db*/
studentSchema.statics.importStudents = function(workSheetsFromFile){
    //存学生前要先删除集合
    // mongoose.connection.db.dropCollection('students');
    Student.remove({}, () => {
        console.log('remove done')
    })

    //存储数据
    for (let i = 0; i < 6; i++) {
        for (let j = 1; j < workSheetsFromFile[i].data.length; j++) {
            var s = new Student({
                'sId': workSheetsFromFile[i].data[j][0], //学号
                'sName': workSheetsFromFile[i].data[j][1], //姓名
                'sGrade': i+1
            })
            s.save().then(()=>{
                console.log('save complete')
            })

        }

    }
}

const Student = mongoose.model('Student', studentSchema)

module.exports = Student