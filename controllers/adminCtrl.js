exports.showAdminDashboard = (req,res) => {
    res.render('./admin/index', {
        page: 'Index'
    })
}


exports.showAdminReport = (req,res)=>{
    res.render('./admin/report', {
        page:'Report'
    })
}