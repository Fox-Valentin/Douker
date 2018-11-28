//设置分页
function setPages(tiaoshu){
	var yexian=20;//每页几条数据
	var ye=  Math.ceil(tiaoshu/yexian);//可以分为几页
	var currentUrl01 = decodeURI(window.location.href);
	var arr01 = currentUrl01.split("?");
	$('#zongye').text(ye);
	$('#dang').html(arr01[1]);
	$(".tcdPageCode").createPage({
	    pageCount:ye,
	    current:1,
	    backFn:function(p){
	        bian(p);
	    }
	});
    $('#tiao').val(arr01[1]);
    // setTimeout(function () {
        $("#zhuan").click()
    // },10);
}

function bian(yeshu){
    var stateObject = {};
    var title = "";
    var newUrl ="" ;
    if(arr01[0]!=parseInt($('#dang').text())){
        newUrl =arr01[0]+"?"+yeshu;
        history.pushState(stateObject,title,newUrl);
    }
}