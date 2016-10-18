// JavaScript Document

jQuery(document).ready(function(e) {
    website_init.init();
});

var website_init = {
	init:function(){
		var that = this;
		that.defineUIEvents();
	},
	defineUIEvents:function(){
		document.querySelector('.sweet-4').onclick = function(){
			swal({
			  title: "Are you sure you want to delete this item?",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonClass: 'btn-danger',
			  confirmButtonText: 'Yes, delete it!',
			  closeOnConfirm: false
			  /*imageUrl: 'images/sweet-alert.jpg'*/
			  //closeOnCancel: false
			},
			function(){
			  swal("Deleted!", "Your imaginary file has been deleted!", "success");
			});
		};	
	}
};