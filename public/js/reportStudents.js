getStudentsBasedOnCoursesRegistered()

function getStudentsBasedOnCoursesRegistered(number) {
    $('#table tr').remove()

    $.get('/student', (students) => {
        $('thead tr th:nth-child(1)').html('Student ID')
        $('thead tr th:nth-child(2)').html('Student name')
        $('thead tr th:nth-child(3)').html('Courses registered')

        $.each(students, (index, item) => {
            if(number!==undefined && item.myCourses.length===number){
                $tr = $('<tr></tr>')
                $('<td style="width: 50px; text-align: center; align="center">'+item.sId+'</td>').appendTo($tr)
                $('<td style="width: 50px; text-align: center; align="center">'+item.sName+'</td>').appendTo($tr)
                $('<td style="width: 50px; text-align: center; align="center">'+item.myCourses.length+'</td>').appendTo($tr)
                $('#table').append($tr)

            }else if(number===undefined){
                $tr = $('<tr></tr>')
                $('<td style="width: 50px; text-align: center; align="center">'+item.sId+'</td>').appendTo($tr)
                $('<td style="width: 50px; text-align: center; align="center">'+item.sName+'</td>').appendTo($tr)
                $('<td style="width: 50px; text-align: center; align="center">'+item.myCourses.length+'</td>').appendTo($tr)
                $('#table').append($tr)

            }
        })
    })
}

$('a[data-myCourseLength]').click(function(){
    getStudentsBasedOnCoursesRegistered(parseInt($(this).attr('data-myCourseLength')))
})

$('#reportStudentsBtn').click(()=>{
    getStudentsBasedOnCoursesRegistered()
})