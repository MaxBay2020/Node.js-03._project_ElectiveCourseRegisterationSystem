$('#reportCoursesBtn').click(()=>[
    $.get('/course', (courses) => {
        $('#table tr').remove()

        $('#myTable thead tr th:nth-child(1)').html('Course ID')
        $('#myTable thead tr th:nth-child(2)').html('Course name')
        $('#myTable thead tr th:nth-child(3)').html('Seats Remaining')

        $.each(courses, (index, item) => {
            $tr=$('<tr></tr>')
            $('<td style="width: 50px; text-align: center; align="center">'+item.cId+'</td>').appendTo($tr)
            $('<td style="width: 50px; text-align: center; align="center">'+item.cName+'</td>').appendTo($tr)
            $('<td style="width: 50px; text-align: center; align="center">'+item.cNumber+'</td>').appendTo($tr)

            $('#table').append($tr)
        })
    })
])