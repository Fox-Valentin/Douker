(function() {
	var prefix = 'http://116.62.234.29:8197'
	window.log = console.log.bind(console)
	var search_params = {}
	var keyword2_ary = []
	var keyword3_ary = []
	var oneCategoryId = 5
	var elements_api_query = function (params) {
		var url = prefix + '/material/query.do'
		$.get(url, params, function(data) {
			log(data)
		});
	}
	function getUrlParam(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
	    var r = window.location.search.substr(1).match(reg)
	    if (r != null) return unescape(r[2]); return null
	}
	var elements_keyword2_query = function (oneCategoryId, fn) {
		var url = prefix + '/categoryTwo/findSelective.do'
		var params = {
			oneCategoryId: oneCategoryId,
			isDelte: 'N'
		}
		$.get(url, params, function(data) {
			if (data.code === 0) {
				fn(data.body)
			}
		});
	}
	var elements_keyword3_query = function (params, fn) {
		var url = prefix + '/categoryThree/selectCategoryThreeList.do'
		params.showType = 1
		$.get(url, params, function(data) {
			if (data.code === 0) {
				fn(data.body)
			}
		});
	}
	// 分类点击事件处理
		function bindKeywordClick(event) {
			var id = $(this).attr('data-id')
			var ddId = $(this).parents('dd').attr('id')
			var isKeyword2 = ddId.indexOf('keyword2') !== -1
			var isKeyword3 = ddId.indexOf('keyword3') !== -1
			isKeyword2 ? search_params.keyword3 = '' : void(0)
			// 是否全选
			if ($(this).hasClass('jsAll')) {
				$(this).addClass('selected')
				isKeyword2 ? search_params.keyword2 = id : void(0)
				isKeyword2 ? search_params.keyword3 = id : void(0)
			} else {
				// 单个分类时 是否已全选
				var $jsAll = $(this).siblings('.jsAll')
				if ($jsAll.hasClass('selected')) {
					$jsAll.removeClass('selected')
					search_params.keyword2 = ''
					search_params.keyword3 = ''
				}
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected')
					isKeyword2 ? keyword2_ary.splice(keyword2_ary.indexOf(id), 1) : void(0)
					isKeyword3 ? keyword3_ary.splice(keyword3_ary.indexOf(id), 1) : void(0)
				} else {
					$(this).addClass('selected')
					if (isKeyword2) {
						keyword2_ary.indexOf(id) === -1 ? keyword2_ary.push(id) : void(0)
					} else if (isKeyword3) {
						keyword3_ary.indexOf(id) === -1 ? keyword3_ary.push(id) : void(0)
					}
				}
				isKeyword2 ? search_params.keyword2 = keyword2_ary.join(',') : void(0)
				isKeyword3 ? search_params.keyword3 = keyword3_ary.join(',') : void(0)
			}
			search_params.oneCategoryId = oneCategoryId
			elements_api_query(search_params)
			if (isKeyword2) {
				function render_keyword3 (id, list, tempAry) {
					var tpl = document.getElementById('tpl_' + id).innerHTML;
					var tpl_str = template(tpl, {list: list, all: tempAry.join(',')});
					$('#dom_' + id).html(tpl_str)
				}
				elements_keyword3_query(search_params, function(body) {
					for (var i = 0; i < body.length; i++) {
						var tempAry = []
						for (var j = 0; j < body[i].categoryThreeValueList.length; j++) {
							tempAry.push(body[i].categoryThreeValueList[j].id)
						}
						switch(body[i].threeCategoryName){
							case '风格':
								render_keyword3('keyword3_1', body[i].categoryThreeValueList, tempAry)
							break;
							case '格式':
								render_keyword3('keyword3_2', body[i].categoryThreeValueList, tempAry)
							break;
							case '主色':
								render_keyword3('keyword3_3', body[i].categoryThreeValueList, tempAry)
							break;
							case '原创':
								render_keyword3('keyword3_4', body[i].categoryThreeValueList, tempAry)
							break;
						}
						bindKeyword3Click()
					}
				})
			}
		}
	// 三级关键字点击搜索事件
	var bindKeyword3Click = function() {
		var domId = 'dom_keyword3_4'
		$('.jsdom_keyword3 a').click(bindKeywordClick);
	}
	// 二级关键字点击搜索事件
	var bindKeyword2Click = function() {
		$('#dom_keyword2 a').click(bindKeywordClick)
	}
	$(document).ready(function() {
		// 一级切换
		$('#categroy_select').children('li').click(function(event) {
			var oneCategoryId = $(this).attr('data-oneCategoryId')
			var tpl = document.getElementById('tpl_keyword2').innerHTML;
			$("#category_wrap").find('a').removeClass('selected')
			elements_keyword2_query(oneCategoryId, function(body) {
				var tempAry = []
				for (var i = 0; i < body.length; i++) {
					tempAry.push(body[i].id)
				}
				var tpl_str = template(tpl, {list: body, all: tempAry.join(',')});
				$('#dom_keyword2').html(tpl_str)
				bindKeyword2Click()
			})
			search_params.oneCategoryId = oneCategoryId
			search_params.keyword2 = ''
			search_params.keyword3 = ''
			elements_api_query(search_params)
		});
		// 搜索
		$('#element_search_keyword_sub').click(function(event) {
			event.preventDefault()
			var keyword = $('#element_search_keyword input').val()
			search_params.keyword = keyword
			elements_api_query(search_params)
		});
	});
})()





