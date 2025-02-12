document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name-field");
    const submitButton = document.getElementById("submit-btn");
    const toggleText = document.getElementById("toggle-text");

    let isLogin = true; // Track if user is in login mode

    function toggleForm() {
        if (isLogin) {
            // Switch to Signup
            formTitle.textContent = "Sign Up";
            nameField.style.display = "block"; // Show name field
            submitButton.textContent = "Sign Up";
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
        } else {
            // Switch to Login
            formTitle.textContent = "Login";
            nameField.style.display = "none"; // Hide name field
            submitButton.textContent = "Login";
            toggleText.innerHTML = "Don't have an account? <a href='#' id='toggle-link'>Sign Up</a>";
        }

        isLogin = !isLogin; // Toggle state

        // Reattach event listener to the newly created link
        document.getElementById("toggle-link").addEventListener("click", function (event) {
            event.preventDefault();
            toggleForm();
        });
    }

    // Initial event listener setup
    document.getElementById("toggle-link").addEventListener("click", function (event) {
        event.preventDefault();
        toggleForm();
    });
});
