"use strict";
 
//importing the neccesary functions from utility.js
import {
    validateEmail,
    validatePassword,
    checkUserCredentials
} from './utility.js';
 
//const for the form and the input fields
const form = document.getElementById("login_form")
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
 
 
 
//clearing the inputfield for email
emailInput.value = "";
 
 
 
form.addEventListener("submit", async function (event) {
    event.preventDefault();
 
    //for accessing the general error messages and icons
    const generalErrorIcon = document.querySelector("#error_icon_general");
    const generalErrorMssg = document.querySelector("#error_message_general");
 
    try {
        //making sure to confirm validity of email and password upon submission as well
        //validation in backend is important to prevent "hacking" of the html form, eg. removing the required or patterns
        //this prevents the user from login in anyways, if their inputs are forcidly invalid
        const emailValid = validateEmail(emailInput);
        const passwordValid = validatePassword(passwordInput);
 
        if (!emailValid) {
            throw new Error("Email not valid.");
        }
        if (!passwordValid) {
            throw new Error("Password not valid.");
        }
 
        const emailValue = emailInput.value;
        console.log(emailValue);
        const passwordValue = passwordInput.value;
 
        //this prevents the user from login in with email or password that doesn't match the ones in our system
        const userValid = await checkUserCredentials(emailValue, passwordValue);
 
        if (userValid) {
            console.log("Login successful");
 
            //removing the general error message
            generalErrorIcon.classList.add("hidden");
            generalErrorMssg.classList.add("hidden");
       
            sessionStorage.setItem('userLogged', emailValue);
 
            window.location.href = "index.html"; 
            
        } else {
            //showing the general error message (abput email not matching)
            generalErrorIcon.classList.remove("hidden");
            generalErrorMssg.classList.remove("hidden");
 
            //throws error
            throw new Error("Invalid email or password.");
        }
    } catch (error) {
        console.error(error.message);
    }
});
 
// Notice there is TWO eventlisteners for checking validity,
// First I let the users finish typing and only check valdity on blur
// Thereafter I check validty on input so the error message dissapears AS SOON as the input is valid
 
let emailBlurOccurred = false;
emailInput.addEventListener("blur", function () {
    if (!emailBlurOccurred) {
        validateEmail(emailInput);
        emailBlurOccurred = true;
    }
});
 
emailInput.addEventListener("input", function () {
    if (emailBlurOccurred) {
        validateEmail(emailInput);
    }
});
 
let passwordBlurOccurred = false;
passwordInput.addEventListener("blur", function () {
    if (!passwordBlurOccurred) {
        validatePassword(passwordInput);
        passwordBlurOccurred = true;
    }
});
 
passwordInput.addEventListener("input", function () {
    if (passwordBlurOccurred) {
        validatePassword(passwordInput);
    }
});
