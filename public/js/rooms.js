$('#private-checkbox').change(function() {
	if(this.checked) {
		$('#private-label').show();
	} else {
		$('#private-label').hide();
	}
});
