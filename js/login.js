"use strict";

const form = document.getElementById("login_form")

const emailInput = form.elements.email;
const passwordInput = form.elements.password;
console.log(emailInput);
console.log(passwordInput);

//checking if the inputted email is valid 
//BEWARE !! (this does not check if the email exists in the system!)
function validateEmail() {
    console.log("check email validity");
    
    //for accesing the error icon and message
    const emailErrorIcon = document.querySelector("#error_icon_email");
    const emailErrorMssg = document.querySelector("#error_message_email");


    //pattern for the email
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/
    // value of the email input field
    const emailValue = emailInput.value
    // tetsing if the inputted email matches the pattern - returns either true or false

    
    //adds or removes error styling based on validity of email
        if (!emailRegex.test(emailValue)) {
           
            emailInput.classList.add("input_error");
            emailInput.classList.remove("input_correct");
            emailErrorMssg.classList.remove("hidden");
            emailErrorMssg.classList.remove("hidden");
            emailErrorIcon.classList.remove("hidden");
        } else {
            emailInput.classList.remove("input_error");
            emailInput.classList.add("input_correct");
            emailErrorMssg.classList.add("hidden");
            emailErrorIcon.classList.add("hidden");
            
        }
    
};

let emailBlurOccurred = false;
// Notice there is TWO eventlisteners for checking validity, 
// First I let the users finish typing and only check valdity on blur
// Thereafter I check validty on input so the error message dissapears as soon as email is valid
emailInput.addEventListener("blur", function() {
    if (!emailBlurOccurred) {
        validateEmail();
        emailBlurOccurred = true;
    }
});

emailInput.addEventListener("input", function() {
    if (emailBlurOccurred) {
        validateEmail();
    }
});

//checking if the inputted password is valid 
//BEWARE !! (this does not check if the password matches the one in the system!)
function validatePassword() {
    console.log("check password validity");
    
    //for accesing the error icon and message
    const passwordErrorIcon = document.querySelector("#error_icon_password");
    const passwordErrorMssg = document.querySelector("#error_message_password");


    //pattern for the email
    //note: the regex uses positive lookahead assertions, to chechk if the password contains
    // atleast one lowercase [a-z]
    // atleast one uppercase [A-Z]
    // atleast one digit \d
    // atleast one special character [@$!%*?&.]
    // is between 8 and 20 characters {8,20}
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,20}$/
    // value of the email input field
    const passwordValue = passwordInput.value
    // tetsing if the inputted email matches the pattern - returns either true or false

    
    //adds or removes error styling based on validity of email
        if (!passwordRegex.test(passwordValue)) {
        //provides the user with specific errormessages on what is missing from their password
            if (!/[a-z]/.test(passwordValue)) {
                passwordErrorMssg.textContent = "Must contain at least one lowercase letter";
            } else if (!/[A-Z]/.test(passwordValue)) {
                passwordErrorMssg.textContent = "Must contain at least one uppercase letter";
            } else if (!/\d/.test(passwordValue)) {
                passwordErrorMssg.textContent = "Must contain at least one number";
            } else if (!/[@$!%*?&.]/.test(passwordValue)) {
                passwordErrorMssg.textContent = "Must contain at least one special character";
            } else if (passwordValue.length < 8) {
                passwordErrorMssg.textContent = "Must be at least 8 characters";
            } else if (passwordValue.length > 20) {
                passwordErrorMssg.textContent = "Must be less than 20 characters";
            }
            passwordInput.classList.add("input_error");
            passwordInput.classList.remove("input_correct");
            passwordErrorMssg.classList.remove("hidden");
            passwordErrorIcon.classList.remove("hidden");
        } else {
            passwordInput.classList.remove("input_error");
            passwordInput.classList.add("input_correct");
            passwordErrorMssg.classList.add("hidden");
            passwordErrorIcon.classList.add("hidden");
        }
    
};

let passwordBlurOccurred = false;
// Notice there is TWO eventlisteners for checking validity, 
// First I let the users finish typing and only check valdity on blur
// Thereafter I check validty on input so the error message dissapears as soon as email is valid
passwordInput.addEventListener("blur", function() {
    if (!passwordBlurOccurred) {
        validatePassword();
        passwordBlurOccurred = true;
    }
});

passwordInput.addEventListener("input", function() {
    if (passwordBlurOccurred) {
        validatePassword();
    }
});






