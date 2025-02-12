document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name-field");
    const emailField = document.getElementById("email-field");
    const passwordField = document.getElementById("password-field");
    const confirmPasswordField = document.getElementById("confirm-password-field");
    const studyPreferences = document.getElementById("study-preferences");
    const forgotPassword = document.getElementById("forgot-password");
    const forgotPasswordEmail = document.getElementById("forgot-password-email");
    const forgotPasswordBtn = document.getElementById("forgot-password-btn");
    const submitBtn = document.getElementById("submit-btn");
    const toggleText = document.getElementById("toggle-text");
    const toggleLink = document.getElementById("toggle-link");

    let isSignup = false;
    let isForgotPassword = false;

    function showLogin() {
        isSignup = false;
        isForgotPassword = false;
        formTitle.textContent = "Login";
        nameField.classList.add("hide");
        confirmPasswordField.classList.add("hide");
        studyPreferences.classList.add("hide");
        emailField.classList.remove("hide");
        passwordField.classList.remove("hide");
        forgotPassword.classList.remove("hide");
        forgotPasswordEmail.classList.add("hide");
        forgotPasswordBtn.classList.add("hide");
        submitBtn.classList.remove("hide");
        submitBtn.textContent = "Login";
        toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Sign Up</a>`;
        attachToggleEvent();
    }

    function showSignup() {
        isSignup = true;
        isForgotPassword = false;
        formTitle.textContent = "Sign Up";
        nameField.classList.remove("hide");
        confirmPasswordField.classList.remove("hide");
        studyPreferences.classList.remove("hide");
        emailField.classList.remove("hide");
        passwordField.classList.remove("hide");
        forgotPassword.classList.add("hide");
        forgotPasswordEmail.classList.add("hide");
        forgotPasswordBtn.classList.add("hide");
        submitBtn.classList.remove("hide");
        submitBtn.textContent = "Sign Up";
        toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
        attachToggleEvent();
    }

    function showForgotPassword() {
        isForgotPassword = true;
        formTitle.textContent = "Reset Password";
        nameField.classList.add("hide");
        emailField.classList.remove("hide");
        passwordField.classList.add("hide");
        confirmPasswordField.classList.add("hide");
        studyPreferences.classList.add("hide");
        forgotPassword.classList.add("hide");
        forgotPasswordEmail.classList.remove("hide");
        forgotPasswordBtn.classList.remove("hide");
        submitBtn.classList.add("hide");
        toggleText.innerHTML = `<a href="#" id="toggle-link">Back to Login</a>`;
        attachToggleEvent();
    }

    function attachToggleEvent() {
        document.getElementById("toggle-link").addEventListener("click", function (e) {
            e.preventDefault();
            if (isForgotPassword) {
                showLogin();
            } else if (isSignup) {
                showLogin();
            } else {
                showSignup();
            }
        });
    }

    forgotPassword.addEventListener("click", function (e) {
        e.preventDefault();
        showForgotPassword();
    });

    attachToggleEvent();
});
