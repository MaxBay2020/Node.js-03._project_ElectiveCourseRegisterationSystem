$(function(){
	//页面加载完成之后执行
	pageInit();
});

function pageInit(){
	// var lastSel;
	var lastsel3;
	//创建jqGrid组件
	jQuery("#list").jqGrid(
			{
				url : '/course',//组件创建完成之后请求数据的url
				datatype : "json",//请求数据返回的类型。可选json,xml,txt
				colNames : [ "ID", "Name", "Day of week", 'Remain', 'Limit', 'Instructor', 'Brief Intro'],//jqGrid的列显示名字
				colModel : [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
				             {name : 'cId',index : 'cId',width : 5, align: 'center'},
				             {name : 'cName',index : 'cName',width : 25, editable: true, align: 'center'},
				             {name : 'cDayofweek',index : 'cDayofweek',width : 15, editable: true, align: 'center', edittype: 'select', editoptions: {value:'Monday:Monday;Tuesday:Tuesday;Wednesday:Wednesday;Thursday:Thursday;Friday:Friday;'}},
				             {name : 'cNumber',index : 'cNumber',width : 5, editable: true, align: 'center'},
				             {name : 'cAllow',index : 'cAllow',width : 25, editable: true, align: 'center'},
				             {name : 'cTeacher',index : 'cTeacher',width : 15, editable: true, align: 'center'},
				             {name : 'cBriefintro',index : 'cBriefintro',width : 50, editable: true, align: 'center', edittype : "textarea"}
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
				multiselect: true, //可以选择条目
				autowidth: true, //填充满表格宽度
				scrollOffset: 2, //如果不设置，表格右边会空出来18px留给滚动条；设置2为刚刚好让滚动条宽度消失，最为美观
				pgbuttons: true,
				emptyrecords: 'Nothing to display',
				// cellEdit: true, //可以编辑单元格
				cellsubmit: 'clientArray', //当编辑完单元格，不发送ajax
				ondblClickRow : function(id) { //当双击行的时候触发的事件
					if (id && id !== lastsel3) {
						jQuery('#list').jqGrid('restoreRow', lastsel3);
						//开始编辑第"id"行，并执行allowChoose函数
						jQuery('#list').jqGrid('editRow', id, true, allowChoose);
						lastsel3 = id;
					}
				},
				afterSaveCell: function (rowId,columnName,value,iRow,iCol){
					//确定改变后获得学号和新值
					//下面这种写法，当换页时，会获取不到新页面的id
					// let sId = $('#list').getCell(iRow, 0)
					// console.log(sId,columnName,value,iRow,iCol)
					//下面这种方法好用！
					var id = $("#list").jqGrid('getGridParam','selrow');//根据点击行获得点击行的id（id为jsonReader: {id: "id" },）
					var rowData = $("#list").jqGrid("getRowData",id);//根据上面的id获得本行的所有数据
					var cId= rowData.cId; //获得指定列的值 （sId 为colModel的name)
					var cName= rowData.cName; //获得指定列的值 （sId 为colModel的name)
					var cDayofweek= rowData.cDayofweek; //获得指定列的值 （sId 为colModel的name)
					var cNumber= rowData.cNumber; //获得指定列的值 （sId 为colModel的name)
					var cAllow= rowData.cAllow; //获得指定列的值 （sId 为colModel的name)
					var cTeacher= rowData.cTeacher; //获得指定列的值 （sId 为colModel的name)
					var cBriefintro= rowData.cBriefintro; //获得指定列的值 （sId 为colModel的name)
					//取得学号，发送ajax之后入库
					$.post('/course/'+cId,{
						cName:cName,
						cDayofweek: cDayofweek,
						cNumber: cNumber,
						cAllow: cAllow,
						cTeacher: cTeacher,
						cBriefintro: cBriefintro
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

	//input输入改变实时更新结果
	$('#keywords').bind('input', () => {
		let keywords = $('#keywords').val()

		//实时查询结果
		$("#list").jqGrid('setGridParam',{  // 重新加载数据
			datatype:'json',
			postData: {keywords: keywords}, //查询条件
			page:1
		}).trigger("reloadGrid") //触发表格重新刷新
	})

	$('#delBtn').click(() => {
		// let s = jQuery("#list").jqGrid('getGridParam', 'selarrrow');

		//参考：https://www.jb51.net/article/50202.htm
		let selrow =$("#list").getGridParam('selarrrow');//获取多行的id
		let sIds=[];//初始化一个数组，用来存放选中的sId值
		$(selrow).each(function (index, value) {//遍历每个id 找到每个data 并把属性加到初始化数组里
			let rowData = $("#list").jqGrid("getRowData", value);
			sIds.push(rowData.sId);
		});

		if(prompt('You are trying to delete '+sIds.length+ ' students.\r\nPlease enter \'delete selected students\' to confirm: ') !== 'delete selected students'){
			swal("Prompt!", "You did not remove any students", "info");
			return
		}else{
			//发送ajax删除选中的学生信息
			$.ajax({
				type: 'delete',
				url: '/student',
				data: {sIds: sIds},
				traditional: true,
				success: (data) => {
					if(data==='1'){
						//1 delete successfully
						swal("Good job!", "You have delete "+sIds.length+" students!", "success");
						//重新加载数据
						//实时查询结果
						$("#list").jqGrid('setGridParam',{  // 重新加载数据
							datatype:'json',
							page:1
						}).trigger("reloadGrid") //触发表格重新刷新

					}else if(data==='-1'){
						//0 delete failed
						swal("Oops!", "Please select students first!", "info");
					}else if(data==='-2'){
						//-2 server error
						swal("Oops!", "Server error. Please contact admin. Error code: -2!", "error");
					}

				}
			})
		}
	})
}

function allowChoose(id) {
	$('#'+id+'_cAllow').hide()
	$('#'+id+'_cAllow').after('<label><input type="checkbox" value="M1"> M1</label><label><input type="checkbox" value="M2"> M2</label><label><input type="checkbox" value="M3"> M3</label><label><input type="checkbox" value="H1"> H1</label><label><input type="checkbox" value="H2"> H2</label><label><input type="checkbox" value="H3"> H3</label>')

	//获得当前现有数据
	let dataArr = $('#'+id+'_cAllow').val().split(',')
	//遍历数组，决定初始勾选项
	$.each(dataArr, (index, value) => {
		$('input[value='+value+']').attr('checked',true)
	})

	//监听所有复选框的改变
	$('#'+id+'_cAllow').nextAll().change(() => {
		let result = []
		//选中的复选框的值推入数据
		$('#'+id+'_cAllow').nextAll().find(':checked').each(function(){ //注意！这里不能用箭头函数，否则会获取不到值
			result.push($(this).val())
		})
		$('#'+id+'_cAllow').val(result.join(','))
	})
}