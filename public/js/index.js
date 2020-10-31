$(function(){
	//页面加载完成之后执行
	pageInit();
});

function pageInit(){
	// var lastSel;
	//创建jqGrid组件
	jQuery("#list").jqGrid(
			{
				url : '/student',//组件创建完成之后请求数据的url
				datatype : "json",//请求数据返回的类型。可选json,xml,txt
				colNames : [ "StudentID", "Name", "Grade", 'Initial Password' ],//jqGrid的列显示名字
				colModel : [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
				             {name : 'sId',index : 'sId',width : 50, align: 'center'},
				             {name : 'sName',index : 'sName',width : 50, editable: true, align: 'center'},
				             {name : 'sGrade',index : 'sGrade',width : 50, editable: true, align: 'center', edittype: 'select', editoptions: {value:'M1:M1;M2:M2;M3:M3;H1:H1;H2:H2;H3:H3'}},
				             {name : 'sPassword',index : 'sPassword',width : 50, editable: false, align: 'center'}
				],
				rowNum : 10,//一页显示多少条
				rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
				height: 400,
				pager : '#pager',//表格页脚的占位符(一般是div)的id
				loadonce: true, //分页必要属性，没有此属性，分页箭头只会显示但是不能点
				// sortname : 'sId',//初始化的时候排序的字段
				// sortorder : "desc",//排序方式,可选desc,asc
				mtype : "get",//向后台请求数据的ajax的类型。可选post,get
				viewrecords : true, //表格右下角显示记录数，如View 1 - 10 of 15
				// caption : "JSON Example"//表格的标题名字
				// multiselect: true,
				autowidth: true, //填充满表格宽度
				scrollOffset: 2, //如果不设置，表格右边会空出来18px留给滚动条；设置2为刚刚好让滚动条宽度消失，最为美观
				pgbuttons: true,
				emptyrecords: 'Nothing to display',
				cellEdit: true, //可以编辑单元格
				cellsubmit: 'clientArray', //当编辑完单元格，不发送ajax
				afterSaveCell: function (rowId,columnName,value,iRow,iCol){
					//确定改变后获得学号和新值
					//下面这种写法，当换页时，会获取不到新页面的id
					// let sId = $('#list').getCell(iRow, 0)
					// console.log(sId,columnName,value,iRow,iCol)
					//下面这种方法好用！
					var id = $("#list").jqGrid('getGridParam','selrow');//根据点击行获得点击行的id（id为jsonReader: {id: "id" },）
					var rowData = $("#list").jqGrid("getRowData",id);//根据上面的id获得本行的所有数据
					var sId= rowData.sId; //获得指定列的值 （sId 为colModel的name)
					var sName= rowData.sName; //获得指定列的值 （sId 为colModel的name)
					var sGrade= rowData.sGrade; //获得指定列的值 （sId 为colModel的name)
					//取得学号，发送ajax之后入库
					console.log(sId, sName, sGrade)
					$.post('/student/'+sId,{
						sName:sName,
						sGrade:sGrade
					}, (data) => {
						if(data==='1'){
							spop({
								template: 'Success',
								autoclose: 2000,
								position  : 'top-right',
								style: 'success',
								group: 'submit-satus',
							});
						}else if(data==='-1'){
							spop({
								template: "No such student with id:"+sId+"in the database. It may be modified by another teacher. Please refresh page.",
								position  : 'top-right',
								style: 'error',
								group: 'submit-satus',
							});
						}else if(data==='-2'){
							spop({
								template: "Server error. Please contact admin. Error code: -2",
								position  : 'top-right',
								style: 'error',
								group: 'submit-satus',
							});
						}
					})

				}
			})

	jQuery('#list').jqGrid('inlineNav', '#pager')
	/*创建jqGrid的操作按钮容器*/
	/*可以控制界面上增删改查的按钮是否显示*/
	jQuery("#list").jqGrid('navGrid', '#pager', {edit : false,add : false,del : false})
}