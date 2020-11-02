let valid = {
    cId:false,
    cName:false,
    cDayofweek:false,
    cNumber: false,
    cAllow: false,
    cTeacher: false,
    cBriefintro: false
}

// //验证学号是否合法
// $('#sId').bind('input', ()=>{
//     //学号必须是9位数字
//     let sId = $('#sId').val()
//     if(/^[\d]{9}$/.test(sId)){
//         //学号通过
//         valid.sId=true
//         //去db查询学号是否存在
//         $.ajax({
//             type: 'checkout',
//             url: '/student/'+sId,
//             success: (data) => {
//                 if(data === '1'){
//                     //1 student id exists
//                     $('#sIdTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Student ID already exists!')
//                 }else if(data==='-1'){
//                     //-1 no such student
//                     $('#sIdTip').removeClass('alert-danger').addClass('alert-success').attr('hidden', false).html('Student ID is good!')
//                 }else if(data === '-2'){
//                     //-2 server error
//                     $('#sIdTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Server error, error code is -2!')
//                 }
//             }
//         })
//     }else{
//         //学号不通过
//         valid.sId=false
//         $('#sIdTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Student ID should be 9 digits!')
//         return
//     }
// })
//
// //验证姓名是否合法
// $('#sName').bind('input', () => {
//     //姓名必须非空
//     let sName = $('#sName').val()
//     if(sName.trim()!==''){
//         //姓名合法
//         $('#sNameTip').removeClass('alert-danger').addClass('alert-success').attr('hidden', false).html('Student name is good!')
//         valid.sName = true
//         return
//     }else{
//         $('#sNameTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Student name cannot be empty!')
//         valid.sName = false
//         return
//     }
// })
//
// //验证年级是否合法
// $('#sGrade').bind('change', () => {
//     let sGrade = $('#sGrade').val()
//     //年级不能为空
//     if(sGrade!=='pleaseSelect'){
//         //年级合法
//         $('#sGradeTip').removeClass('alert-danger').addClass('alert-success').attr('hidden', false).html('Student grade is good!')
//         valid.sGrade = true
//     }else{
//         //年级不合法
//         $('#sGradeTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Please select student grade!')
//         valid.sGrade = false
//     }
// })
//
// //验证密码是否合法
// $('#sPassword').bind('input', ()=>{
//     let sPassword = $('#sPassword').val()
//     //密码不能为空
//     if(sPassword.trim()!==''){
//         //密码合法
//         $('#sPasswordTip').removeClass('alert-danger').addClass('alert-success').attr('hidden', false).html('Student passowrd is good!')
//         valid.sPassword = true
//     }else{
//         //密码不合法
//         $('#sPasswordTip').removeClass('alert-success').addClass('alert-danger').attr('hidden', false).html('Student password cannot be empty!')
//         valid.sPassword = false
//     }
// })
//
// $('[checkValid]').change(() => {
//     let allValid = true
//     for(let k in valid){
//         if(!valid[k]){
//             allValid=false
//             break
//         }
//     }
//     console.log(valid)
//     if(allValid){
//         $('#submitBtn').attr('disabled', false)
//     }
// })

//提交表单
$('#submitBtn').click(() => {
    let cId = $('#cId').val()
    let cName = $('#cName').val()
    let cDayofweek = $('#cDayofweek').val()
    let cNumber = $('#cNumber').val()
    let cAllow = (function () {
        let arr = []
        $('input[name=cAllow]:checked').each(function(){ //这里不能用箭头函数，否则会出错
            arr.push($(this).val())
        })
        return arr
    })()
    let cTeacher = $('#cTeacher').val()
    let cBriefintro = $('#cBriefintro').val()

    //发送ajax提交数据
    $.ajax({
        type:'post',
        url: '/course',
        traditional: true,
        data: {
            cId:cId,
            cName:cName,
            cDayofweek:cDayofweek,
            cNumber:cNumber,
            cAllow:cAllow,
            cTeacher:cTeacher,
            cBriefintro:cBriefintro
        },
        success: (data) => {
            if(data === '-2'){
                //-2 server error
                spop({
                    template: "Oops! Add failed",
                    position  : 'top-right',
                    style: 'error',
                    group: 'submit-satus',
                })
            }else if(data==='1'){
                //1 student exists
                spop({
                    template: "Oops! Course exists. It maybe added by another teacher",
                    position  : 'top-right',
                    style: 'error',
                    group: 'submit-satus',
                })

                //clear form
                $('input').val('')
                $('textarea').val('')
                //重制valid对象
                let valid = {
                    cId:false,
                    cName:false,
                    cDayofweek:false,
                    cNumber: false,
                    cAllow: false,
                    cTeacher: false,
                    cBriefintro: false
                }
                //提示框消失
                $('.myTip').attr('hidden', true)
            } else if(data==='0'){
                //0 add successfully
                spop({
                    template: 'Add successfully',
                    autoclose: 2000,
                    position  : 'top-right',
                    style: 'success',
                    group: 'submit-satus',
                })

                //clear form
                $('input').val('')
                $('textarea').val('')
                //重制valid对象
                let valid = {
                    cId:false,
                    cName:false,
                    cDayofweek:false,
                    cNumber: false,
                    cAllow: false,
                    cTeacher: false,
                    cBriefintro: false
                }
                //提示框消失
                $('.myTip').attr('hidden', true)
            }
        }
    })
})

// //download request ajax
// $('#downloadBtn').click(()=> {
//     $.get('/admin/student/download', (data) => {
//         if(data==='-1'){
//             //-2 server error
//             spop({
//                 template: "<h4 class=\"spop-title\">Error</h4>Downloaded failed, please try again",
//                 position  : 'top-right',
//                 style: 'error',
//                 group: 'submit-satus',
//             })
//         }else{
//             //1 download successfully
//             spop({
//                 template: '<h4 class="spop-title">Success</h4>Downloaded completed',
//                 autoclose: 2000,
//                 position  : 'top-right',
//                 style: 'success',
//                 group: 'submit-satus',
//             })
//             //跳转到excel文件的url，开启下载
//             window.location=data
//         }
//     })
// })