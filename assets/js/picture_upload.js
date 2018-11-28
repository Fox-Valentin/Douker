(function() {
	var prefix = 'http://116.62.234.29:8197'
	window.log = console.log.bind(console)
//获取选择的图片
var tmpimgurl='';
function getPhoto(obj) {
    var imgURL = "";
    try{
        var file = null;
        if(obj.files && obj.files[0] ){
            file = obj.files[0];
        }else if(obj.files && obj.files.item(0)) {
            file = obj.files.item(0);
        }
        try{
            imgURL =  file.getAsDataURL();
        }catch(e){
            imgRUL = window.URL.createObjectURL(file);
        }
    }catch(e){
        if (obj.files && obj.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(obj.files[0]);
        }
    }
    creatImg(imgRUL);
    var oneimagename = getFileName($(obj).val());
    $('.oneuptext').val(oneimagename);
	var formData = new FormData(document.getElementById("file"));
	console.log(formData.get('file'));
	//上传图片接口
	$.ajax({
		type: 'POST',
		url: prefix + "/upload/resImage.do",
		data: formData,
		processData: false,// ⑧告诉jQuery不要去处理发送的数据
		contentType: false, // ⑨告诉jQuery不要去设置Content-Type请求头
		success: function (responseStr) {
			console.log(responseStr);
			if(responseStr.code == 0){
				sessionStorage.setItem('imageUrl',responseStr.body.image);
				sessionStorage.setItem('imageDimension',responseStr.body.dimension);
				tmpimgurl=responseStr.body.imageTmp
				//$('.onehiteImage').html('图片上传成功');
			}else{
				//$('.onehiteImage').html('图片上传失败，重新上传');
			}
		},
		error : function (responseStr) {
			console.log(responseStr);
		}
	});
    return imgURL;
}
//素材图片回显
function creatImg(imgRUL){
    $(".picture_view").css({
    	'backgroundImage':'url('+imgRUL+')',
    	'backgroundPosition': '50% 50%',
    	'backgroundRepeat': 'no-repeat'
    });
}
//获取文件或图片名称
function getFileName(file){
    var pos = file.lastIndexOf("\\");
    return file.substring(pos+1);
}

//上传源文件
function files(){
	var formData = new FormData(document.getElementById("files"));
    $.ajax({
        type: 'POST',
        url: prefix + "/upload/resFile.do",
        data: formData,
        processData: false,// ⑧告诉jQuery不要去处理发送的数据
        contentType: false, // ⑨告诉jQuery不要去设置Content-Type请求头
        success: function (responseStr) {
        	console.log(responseStr);
        	if(responseStr.code == 0){
        		sessionStorage.setItem('sourceFileUrl',responseStr.body.url);
        		sessionStorage.setItem('sourceFileSize',responseStr.body.size);
        		//$('.hiteImage').html('源文件上传成功');
        	}
        },
        error : function (responseStr) {
            console.log(responseStr);
        }
    });
}
//获取源文件名称
function getFiles() {
	var uploadfile = $("#uploadFile").val(); 
    var fileName= getFileName(uploadfile);
    $('.px_file').val(fileName);
}
$(document).ready(function() {
	$("#handleUp").click(function(event) {
		var val = $('.px_file').val()
		if (val) {
			files();
		}
	})
	$("#handleSearch").click(function(event) {
		$("#uploadFile").trigger('click')
	});
	$("#subApproval").click(submitAudit);
});

//提交审核
function submitAudit(){
	var materialName = $('.fileName').val();
	var materialUrl = sessionStorage.getItem('sourceFileUrl');
	var coverUrl = sessionStorage.getItem('imageUrl');
	var type = $('.twoTypeP input:checked').attr('data-id');
	// var uploadUserId = $.cookie('USERID');//430
	var uploadUserId = '430'//430
	// var uploadUserName = $.cookie('USERPHONE');//18903211504
	var uploadUserName = '18903211504'//
	var keywords = $('.fileName').val().split('的').join(',');
	var oneCategoryId = $('.typeP input:checked').attr('data-id');
	var oneCategoryName = $('.typeP input:checked').next().text();
	var dimension = sessionStorage.getItem('imageDimension');
	var size = sessionStorage.getItem('sourceFileSize');
	if($('.oneuptext').val()==''){
		alert('设计名称不得为空')
	}else{
		$.ajax({
			type: 'POST',
			url: prefix + "/material/save.do",
			data: {
				materialName: materialName,
				materialUrl: materialUrl,
				coverUrl: coverUrl,
				type: type,
				uploadUserId: uploadUserId,
				uploadUserName: uploadUserName,
				keywords: keywords,
				oneCategoryId: oneCategoryId,
				oneCategoryName: oneCategoryName,
				dimension: dimension,
				size: size,
				materialUrlTmp:tmpimgurl
			},
			success: function (responseStr) {
				console.log(responseStr);
				if(responseStr.code == 0){
					$('.auditHito').html('提交审核成功');
					setTimeout(function(){
						// location.href="../pages/home.html"
					},1000);
					
				}
			},
			error : function (responseStr) {
				console.log(responseStr);
			}
		});
	}
}
window.getPhoto = getPhoto
window.getFiles = getFiles
})(window)