// page init
jQuery(function(){
"use strict";
	//FixedHeader();
	ImageFitCont();
});

// Fixed Header
function FixedHeader() {
	var lastScrollTop = 0, delta = 5;
	
		$(window).scroll(function(event){
		   var st = $(this).scrollTop();
		   
		   if(Math.abs(lastScrollTop - st) <= delta)
			  return;
		   
		   if (st > lastScrollTop){
				// downscroll code
				$('.site-header').addClass('fix-head').css({top:'-40px'})
				.hover(function(){$(".site-header").css({top: '0px'})})
		   } 
		   if (st < 50){
		   // downscroll code
		   	$('.site-header').removeClass('fix-head').css({top:'0px'});
		   }
		   else {
			  // upscroll code
			  //$('.site-header').removeClass('fix-head');
		   }
		   lastScrollTop = st;
		});

}


// Image Fit Container
function ImageFitCont() {
	"use strict";
	$('.imageFit').imgLiquid({
		fill: true,
        horizontalAlign: 'center',
        verticalAlign: 'center'
	});
}



$( function() {
	"use strict";
	
	$('.scroll-top').on('click', function() {
    	$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	
	// Child Tab
	// $('#PatientReports').easyResponsiveTabs({
	// 	type: 'vertical',
	// 	width: 'auto',
	// 	fit: true,
	// 	tabidentify: 'ver_1'
	// });

	// $('.pickdate').datetimepicker({
	// 	format: 'DD/MM/YYYY'
	// });
	
	// $("[data-toggle=popover]").popover({
	// 	container:'body'	
	// });
	
	
});

// $(window).on('load',function() {
// 	"use strict";
// 	// setTimeout(function(){
// 	// 	activeuser.innerHTML = 1200;
// 	// }, 1500);
	
// 	// setTimeout(function(){
// 	// 	patreport.innerHTML = 356;
// 	// }, 1000);
// });

$(document).on('click', '.close-panel', function(event){
	event.preventDefault();
	//alert();
	$(this).closest('.collapse').collapse('hide');
});

$(document).on({
    mouseenter: function () {
        $('.update-report').addClass('drk-bdr');
    },
    mouseleave: function () {
        $('.update-report').removeClass('drk-bdr');
    }
}, '.close-report');
