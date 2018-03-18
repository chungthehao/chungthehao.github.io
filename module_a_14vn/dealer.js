var totalClients = 0;
var brandlist = new Array("Porsche","Volkswagen","Audi","BMW");
var brandlistalias = new Array("porsche","volkswagen","audi","bmw");
var brandlistcost = new Array(72500, 23930, 31260, 43990);
var maxClients = 10;
var myServed = 0;
var myCost = 0;
var myCar = 0;

var porscheInStock = 4;
var volkswagenInStock = 6;
var audiInStock = 5;
var bmwInStock = 3;

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
			accept: '#clients_queue div.client[brand-id='+i+']',
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
			accept: '#clients_queue div.client[brand-id='+i+']',
			greedy: true, // Tham lam, gần là lấy luôn
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
				myServed++;
				car_id = ui.draggable.attr('car_id');
				$('#' + car_id)	.droppable('option','disabled',false)
								.removeClass('served')
								.addClass('free');

				// Cho vùng hãng xe drop đc
				// (ngta exit ==> chắc chắn có 1 xe free)
				// CHÚ Ý: có thể đang là cho drop luôn, kệ, cứ làm
				brand_alias = car_id.substring(0, car_id.indexOf('-'));
				$('#' + brand_alias).droppable('enable');
				// <=> droppable('option','disabled',false)
			}else{// bên phải kéo qua exit
				totalClients--;
			}
			updateDisplayInfo();
			ui.draggable.appendTo('#exit') // or appendTo($(this))
						.css({
								'position' : 'absolute',
								'left' : '50%',
								'top' : '50%',
								'margin-left' : '-41px',
								'margin-top' : '-41px'
							})
						.fadeOut('2000', function() {
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
					.fadeOut('3000', function() {
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
				brand_alias = car_id.substring(0, car_id.indexOf('-'));
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
					.fadeOut('2000', function() {
						$('#cashier').empty();
					});
			}
			updateDisplayInfo();
		}
	})

	newClient();
}); // hết sự kiện ready
