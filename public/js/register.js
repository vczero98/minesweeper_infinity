function passwordsMatch() {
	return $("#input-password").val() == $("#confirm-password").val();
}

$('#input-password, #confirm-password').on('keyup', function () {
  if (passwordsMatch()) {
    $('#confirm-password').css("background-color", "");
  } else {
		$('#confirm-password').css("background-color", "#ffbcbc");
	}
});

function validateForm() {
  if (!passwordsMatch()) {
		showError("Passwords must match!");
		return false;
	} else if ($("#input-password").val().length < 6) {
		// showError("The password must be at least 6 characters in length.");
		// return false;
	}

	return true;
}

function showError(errorMessage) {
	$("#display-error").text(errorMessage);
}
