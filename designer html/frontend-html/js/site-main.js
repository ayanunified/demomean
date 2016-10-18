// JavaScript Document

$(document).ready(function(e) {
    siteneccesities.init();
	
});
$(window).load(function(e){
	siteneccesities.loadflesslider('belong-anywhere');
});

var private_offset='';
var siteneccesities = {
	init:function(){
		var that = this;
		that.defineUIEvents();
		that.loadOwlcarousel();
		that.loadvideogallery();
		that.ImageFitCont();
		that.loadhomeflex();
		that.loadheaderdatetimepicker();
		if($('.private-content').length>0)
			private_offset=$('.private-content').offset().top;
	},
	ImageFitCont:function(){
		$('.imageFit').imgLiquid({
			fill: true,	
			horizontalAlign: 'center',	
			verticalAlign: 'center'	
		});
	},
	inithomemap:function(){
		var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.674, lng: -73.945},
          zoom: 12,
          styles: [
            {
              featureType: 'all',
              stylers: [
                { saturation: -80 }
              ]
            },{
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [
                { hue: '#eaeaea' },
                { saturation: 50 }
              ]
            },{
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ]
        });	
	},
	initMap:function(){
		var map;
		map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
	},
	loadhomeflex:function(){
		$('#carousel').flexslider({		
			animation: "slide",		
			controlNav: false,		
			animationLoop: false,		
			slideshow: false,		
			itemWidth: 153,		
			itemMargin: 0,		
			asNavFor: '#slider'		
		});
		$('#slider').flexslider({		
			animation: "slide",		
			controlNav: false,		
			animationLoop: false,		
			slideshow: false,		
			sync: "#carousel",
			directionNav:false		
		});
	},
	loadOwlcarousel:function(){
		$('.owl-carousel.pop_city').owlCarousel({
			loop:true,
			margin:10,
			responsiveClass:true,
			nav:false,
			dots:true,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:3
				},
				1000:{
					items:3,
					loop:false
				}
			}
		});	
	},
	loadvideogallery:function(){
		$('#html5-videos').lightGallery(); 
	},
	loadflesslider:function(parentclass){
		 $('.'+parentclass+' .flexslider').flexslider({
			animation: "fade"
		  });	
	},
	loadheaderdatetimepicker:function(){
		$('#datetimepicker6').datetimepicker({
			format: 'DD/MM/YYYY'
		});
        $('#datetimepicker7').datetimepicker({
			format: 'DD/MM/YYYY',
            useCurrent: false //Important! See issue #1075
        });
        $("#datetimepicker6").on("dp.change", function (e) {
            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker7").on("dp.change", function (e) {
            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
        });
	},
	defineUIEvents:function(){
		//load isotopes for servicesection
		$('.service-home-section .grid').isotope({
			  itemSelector: '.grid-item',
			  percentPosition: true,
			  masonry: {
				columnWidth: '.grid-sizer',
				gutter: 6,
				fitWidth: true				
			  }
		});
		//search click in header
		$(document).on('click','.search-toggle',function(){
			$('.search-container').slideToggle();	
		});	
		//tabs responsive
		$(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
			var $target = $(e.target);
			var $tabs = $target.closest('.nav-tabs-responsive');
			var $current = $target.closest('li');
			var $parent = $current.closest('li.dropdown');
				$current = $parent.length > 0 ? $parent : $current;
			var $next = $current.next();
			var $prev = $current.prev();
			var updateDropdownMenu = function($el, position){
			  $el
				.find('.dropdown-menu')
				.removeClass('pull-xs-left pull-xs-center pull-xs-right')
				.addClass( 'pull-xs-' + position );
			};
		
			$tabs.find('>li').removeClass('next prev');
			$prev.addClass('prev');
			$next.addClass('next');
			
			updateDropdownMenu( $prev, 'left' );
			updateDropdownMenu( $current, 'center' );
			updateDropdownMenu( $next, 'right' );
		 });
		 //scroll fixed fror privatehomedetails
		 jQuery(window).scroll(function(event){
			 var st = jQuery(this).scrollTop();
			 if(st > private_offset){
				jQuery('.private-details-account').addClass('fixed');	 
			 }
			 else{
				 jQuery('.private-details-account').removeClass('fixed');	 
			 }
		 });
	}
};


