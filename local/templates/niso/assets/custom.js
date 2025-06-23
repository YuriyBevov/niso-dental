document.addEventListener("DOMContentLoaded", function () {
	const buttons = document.querySelectorAll("[data-doctor]");
	const doctorInput = document.getElementById("doctorNameField");

	buttons.forEach((button) => {
		button.addEventListener("click", function () {
			const doctorName = this.getAttribute("data-doctor");
			console.log("clicked", doctorName);
			if (doctorInput) {
				doctorInput.value = doctorName;
			}
		});
	});
});
