exports.showAdminDashboard = (req,res) => {
    res.render('./admin/index', {
        page: 'index'
    })
}


exports.showAdminReport = (req,res)=>{
    res.render('./admin/report', {
        page:'report'
    })
}