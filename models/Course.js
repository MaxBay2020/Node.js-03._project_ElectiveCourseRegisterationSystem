const mongoose = require('mongoose')

const { Schema } = mongoose

const courseSchema = new Schema({
    cId             : String,
    cName           : String,
    cDayofweek      : String,
    cNumber         : Number,
    cAllow          : [String],
    cTeacher        : String,
    cBriefintro     : String,
    myStudents       : [String]
})

/*import into db*/

const Course = mongoose.model('Course', courseSchema)

module.exports = Course