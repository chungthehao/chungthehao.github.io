var totalClients = 0;
var brandlist = new Array("Porsche","Volkswagen","Audi","BMW");
var brandlistalias = new Array("porsche","volkswagen","audi","bmw");
var brandlistcost = new Array(72500, 23930, 31260, 43990);
var maxClients = 10;
var myServed = 0;
var myCost = 0;
var myCar = 0;

var noVacancyBrandId = new Array();

function newClient(){
	var preference = Math.floor((Math.random()*4));// random từ 0 - 3 để làm key gọi phần tử mảng hiệu xe
	var time = Math.floor((Math.random()*3000)+1);// random từ 1 - 10 000 milisec thì lặp lại 
	var client = Math.floor((Math.random()*10)+1); // random từ 1 - 10, vì có 10 hình client
	if(totalClients < 10){
		$("#clients_queue").append('<div class="client client_'+client+'" brand-id="'+preference+'"><span class="preference">Client for '+brandlist[preference]+'</span></div>');
		totalClients += 1;
	}
	nextClient();
	// Sau 1 khoảng thời gian ngẫu nhiên từ 1 msec đến 10 000 msec
	// thì gọi hàm newClient() để tạo mô phỏng có 1 khách hàng mới
	// CHÚ Ý: 	mặc dù hàm newClient() đc gọi nhưng nếu số kh >= 10
	// 			thì k tạo mới nữa.
	setTimeout(function(){newClient();},time);
}

/*
 * Hàm nextClient():
 *  + div.client nào là con đầu tiên của clients_queue thì drag đc
 */
function nextClient(){
	var client = $('#clients_queue div.client:first');
	var brand_id = client.attr('brand-id');

	client.draggable({
		revert: function(valid){ // nếu hợp lệ
			return !valid;		 // thì k hoàn lại (revert)
		}
	})
}

function updateDisplayInfo(){
	$('#clients_served').html(myServed + ' clients');
	$('#cars_sold').html(myCar + ' cars');
	$('#amount').html('€ ' + myCost);
}

// + Hàm cập nhật các hãng xe ko còn trống (đều đang xem / bán)
// + Nếu khách hàng rơi vào tình huống đó thì có thể xem
// bất kỳ hãng xe nào còn trống (đánh dấu bằng id = 'valid')
// + Hàm này chạy lặp lại, để cập nhật liên tục
function checkVacancy(){
	var i = 0;
	for(i; i < brandlist.length; i++){
		// Nếu hãng xe này ko trống, đang xem | vừa chiếc đang xem vừa chiếc bán rồi | bán hết rồi
		if($('#cars_place #'+brandlistalias[i]).hasClass('ui-state-disabled')){
			// Nếu đã cập nhật rồi thì thôi (vào mảng chứa các brand-id của hãng xe ko còn trống)
			if($.inArray(i, noVacancyBrandId) == -1){
				noVacancyBrandId.push(i);
			}
		// Nếu hãng xe này còn trống chỗ mà có trong mảng ko còn trống
		// thì cập nhật lại
		}else if($('#cars_place #'+brandlistalias[i]).hasClass('ui-droppable')){
			if($.inArray(i, noVacancyBrandId) != -1){
				var index = noVacancyBrandId.indexOf(i);
				noVacancyBrandId.splice(index, 1);
			}
		}
	}
	var firstClient = $('#clients_queue div.client:first');

	if($.inArray(parseInt(firstClient.attr('brand-id')), noVacancyBrandId) != -1){
		firstClient.attr('id', 'valid');
		firstClient.attr('brand-id', -69);
		firstClient.html('<span class="preference">Valid</span>');
	}
	// console.log('Có brand-id thuộc mảng hết chỗ: ' + $.inArray(parseInt(firstClient.attr('brand-id')), noVacancyBrandId) );
	// console.log('brand-id của first client: '+firstClient.attr('brand-id'));
	// console.log('Mảng hết chỗ: '+noVacancyBrandId);
	setTimeout(function(){checkVacancy();},1000);
}

$("document").ready(function() {
	// Thêm 1 class tên là 'free' cho mấy thẻ có class là 'car'
	$('.car').each(function(){
		$(this).addClass('free');
	})

	var i = 0;
	for(i; i < brandlist.length; i++){
		// Area: Nguyên vùng hãng xe
		$('#cars_place #'+brandlistalias[i]).droppable({
			// Khách hàng muốn xem xe hãng nào, chỉ cho phép vô hãng đó
			// Chấp nhận k/h nào có brand-id(0,1,2,3) tương ứng 
			// với id(porsche,volkswagen,audi,bmw) của tui, tui mới cho
			accept: '#clients_queue div.client[brand-id='+i+'], #valid',
			drop: function(event, ui){

				// cập nhật số khách đang đợi
				totalClients--;
				/*
				 * Ý nghĩa: chỉ là chuyển đổi từ value --> key của 1 mảng
				 * 	<div id="cars_place">
        			<div id="porsche" class="place">
        		 * CHÚ Ý: $.inArray returns the index of the element if found or -1 if it isn't -- not a boolean value
				 */
				var brand_id = $.inArray($(this).attr('id'), brandlistalias);

				/*
				 * target tới --> 	Chiếc xe đầu tiên [0] còn trống /free/
				 * 					(từ trái qua) của hãng xe (#porsche/#audi/..)
				 * 					đang đc drop vào
				 */
				var served_car = $('#' + brandlistalias[brand_id] + " .car.free")[0];

				ui.draggable
					.addClass('served') // làm dấu là k/h này đang đc phục vụ
					.appendTo(served_car) // thêm cái div k/h này vào trong div xe
					.css({	'position'	: 	'absolute',
							'left'		: 	'0',
							'top'		: 	'40px',
							'background-size': 'contain',
							'width'		: 	'50px',
							'height'	: 	'50px'
						})
					.attr('car_id', $(served_car).attr('id'));

				if(ui.draggable.attr('id') == 'valid'){
					// alert(brand_id);
					ui.draggable.attr('brand-id', brand_id);
					ui.draggable.removeAttr('id');
				}

				// làm dấu là xe đang đc người ta xem, 
				// mấy class này k có CSS, chỉ để làm dấu
				$(served_car).removeClass('free').addClass('served');
				// Xe đang đc ngta xem thì ko nhận ng xem khác nữa
				$(served_car).droppable('disable');

				// Nếu ko còn xe nào free thì ko cho drop vào
				if($('#' + brandlistalias[brand_id] + ' .car.free').length == 0){
					$('#' + brandlistalias[brand_id]).droppable('disable');
				}
			} // hết drop
		}) // hết droppable

		// Area: trong từng chiếc xe
		$('#cars_place #'+brandlistalias[i]+' .car').droppable({
			// Khách hàng muốn xem xe hãng nào, chỉ cho phép vô hãng đó
			// Chấp nhận k/h nào có brand-id(0,1,2,3) tương ứng 
			// với id(porsche,volkswagen,audi,bmw) của tui, tui mới cho
			accept: '#clients_queue div.client[brand-id='+i+'], #valid, div.client.served[brand-id='+i+']',
			greedy: true, // Tham lam, gần là lấy luôn
			drop: function(event, ui){
				// Nếu k/h đang chuyển giữa các xe trong cùng 1 hãng..
				if(ui.draggable.hasClass('served')){
					car_id_old = ui.draggable.attr('car_id');
					$('#' + car_id_old)	.removeClass('served')
										.addClass('free')
										.droppable('enable');
				}else{
					// + Cập nhật số khách đang đợi
					// + Không cập nhật khi k/h chỉ chuyển qua lại
					// xem xe khác trong cùng 1 hãng (ko phải từ bên xếp hàng qua)
					totalClients--;
				}
				/*
				 * Ý nghĩa: chỉ là chuyển đổi từ value --> key của 1 mảng
				 * 	<div id="cars_place">
        			<div id="porsche" class="place">
        		 * CHÚ Ý: $.inArray returns the index of the element if found or -1 if it isn't -- not a boolean value
				 */
				var brandalias = $(this).attr('id').substring(0, $(this).attr('id').indexOf('-'))
				var brand_id = $.inArray(brandalias, brandlistalias);

				/*
				 * target tới --> 	Chính chiếc xe này
				 */
				var served_car = $(this).get();

				ui.draggable
					.addClass('served') // làm dấu là k/h này đang đc phục vụ
					.appendTo(served_car) // thêm cái div k/h này vào trong div xe
					.css({	'position'	: 	'absolute',
							'left'		: 	'0',
							'top'		: 	'40px',
							'background-size': 'contain',
							'width'		: 	'50px',
							'height'	: 	'50px'
						})
					.attr('car_id', $(served_car).attr('id'));

				if(ui.draggable.attr('id') == 'valid'){
					// alert(brand_id);
					ui.draggable.attr('brand-id', brand_id);
					ui.draggable.removeAttr('id');
				}

				// làm dấu là xe đang đc người ta xem, 
				// mấy class này k có CSS, chỉ để làm dấu
				$(served_car).removeClass('free').addClass('served');
				// Xe đang đc ngta xem thì ko nhận ng xem khác nữa
				$(served_car).droppable('disable');

				// Nếu ko còn xe nào free thì ko cho drop vào
				if($('#' + brandlistalias[brand_id] + ' .car.free').length == 0){
					$('#' + brandlistalias[brand_id]).droppable('disable');
				}
			}
		})
	} // hết vòng for

	$('#exit').droppable({
		accept: '.client',
		drop: function(event, ui){
			if(ui.draggable.hasClass('served')){// kéo từ trái qua
				car_id = ui.draggable.attr('car_id');
				$('#' + car_id)	.droppable('option','disabled',false)
								.removeClass('served')
								.addClass('free');

				// Cho vùng hãng xe drop đc
				// (ngta exit ==> chắc chắn có 1 xe free)
				// CHÚ Ý: có thể đang là cho drop luôn, kệ, cứ làm
				brand_id = ui.draggable.attr('brand-id');
				brand_alias = brandlistalias[brand_id];
				$('#' + brand_alias).droppable('enable');
				// <=> droppable('option','disabled',false)
			}else{// bên phải kéo qua exit
				totalClients--;
			}
			updateDisplayInfo();
			ui.draggable.appendTo('#exit') // or appendTo($(this))
			if(ui.draggable.hasClass('served')){
				ui.draggable.css({
								'position' : 'absolute',
								'left' : '50%',
								'top' : '50%',
								'margin-left' : '-21px',
								'margin-top' : '-21px'
							});
			}else{
				ui.draggable.css({
								'position' : 'absolute',
								'left' : '50%',
								'top' : '50%',
								'margin-left' : '-41px',
								'margin-top' : '-41px'
							});
			}
			ui.draggable.fadeOut(1200, function() {
				$('#exit').empty();
				// or $(this).remove(); k giống như trên
				// $(this) lúc này k phải là $('#exit')
				// mà là 1 client nào đó
			});
		}
	})

	$('#cashier').droppable({
		accept: '.client.served',
		drop: function(event, ui){
			myServed++;
			if(window.confirm('Are you sure you wanna buy this car?')){
				myCar++;
				myCost += brandlistcost[ui.draggable.attr('brand-id')];

				car_id = ui.draggable.attr('car_id');
				$('#'+car_id).css('background-image','url("images/sold2.jpg")');

				ui.draggable
					.appendTo('#cashier')
					.css({
						'position' : 'absolute',
						'top' : '50%',
						'left' : '50%',
						'margin-top' : '-26px',
						'margin-left' : '-26px',
					})
					.fadeOut(1200, function() {
						$('#cashier').empty();
					});
			}else{ // ngta k mua
				car_id = ui.draggable.attr('car_id');
				$('#' + car_id)	.droppable('option','disabled',false)
								.removeClass('served')
								.addClass('free');
				// Cho vùng hãng xe drop đc 
				// (ngta ko mua ==> chắc chắn có 1 xe free)
				// CHÚ Ý: có thể đang cho drop luôn, kệ, cứ làm
				brand_id = ui.draggable.attr('brand-id');
				brand_alias = brandlistalias[brand_id];
				$('#' + brand_alias).droppable('enable');

				ui.draggable
					.appendTo('#exit')
					.css({
						'position' : 'absolute',
						'top' : '50%',
						'left' : '50%',
						'margin-top' : '-26px',
						'margin-left' : '-26px',
					})
					.fadeOut(1200, function() {
						$('#cashier').empty();
					});
			}
			updateDisplayInfo();
		}
	})

	newClient();
	checkVacancy();
}); // hết sự kiện ready
