"use strict";
 
 
//endpoint for local storage of users
const user_db = "http://localhost:3000/users";
 
//function for handling error styling, is called from within email and password validator
function setErrorStyles(input, message, icon, messageText, isValid) {
    if (!isValid) {
        input.classList.add("input_error");
        input.classList.remove("input_correct");
        message.classList.remove("hidden");
        icon.classList.remove("hidden");
        message.textContent = messageText;
    } else {
        input.classList.remove("input_error");
        input.classList.add("input_correct");
        message.classList.add("hidden");
        icon.classList.add("hidden");
    }
}
 
//checking if the inputted email is valid
//BEWARE !! (this does not check if the email exists in the system!)
function validateEmail(emailInput) {
    console.log("check email validity");
 
    //for accesing error messages and icons
    const emailErrorIcon = document.querySelector("#error_icon_email");
    const emailErrorMssg = document.querySelector("#error_message_email");
 
    //pattern for the email
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/
    // value of the email input field
    const emailValue = emailInput.value
 
    // tetsing if the inputted email matches the pattern - returns either true or false, and stores in isValid
    const isValid = emailRegex.test(emailValue);
    //setting styles
    setErrorStyles(emailInput, emailErrorMssg, emailErrorIcon, "Please enter a valid email", isValid);
 
    //returning isValid to use later upon handling submission
    return isValid;
}
 
//checking if the inputted password is valid
//BEWARE !! (this does not check if the password matches the one in the system!)
function validatePassword(passwordInput) {
    console.log("check password validity");
    //pattern for the password
    //note: the regex uses positive lookahead assertions, to chechk if the password contains
    // atleast one lowercase [a-z]
    // atleast one uppercase [A-Z]
    // atleast one digit \d
    // atleast one special character [@$!%*?&#.]
    // is between 8 and 20 characters {8,20}
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,20}$/
 
    //for accesing error messages and icons
    const passwordErrorIcon = document.querySelector("#error_icon_password");
    const passwordErrorMssg = document.querySelector("#error_message_password");
 
 
    // value of the password input field
    const passwordValue = passwordInput.value
 
    //changing the error message based on what is missing from the password
    let message = "Please enter valid password";
 
    if (!/[a-z]/.test(passwordValue)) {
        message = "Must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(passwordValue)) {
        message = "Must contain at least one uppercase letter";
    } else if (!/\d/.test(passwordValue)) {
        message = "Must contain at least one number";
    } else if (!/[@$!%*?&#.]/.test(passwordValue)) {
        message = "Must contain at least one special character";
    } else if (passwordValue.length < 8) {
        message = "Must be at least 8 characters";
    } else if (passwordValue.length > 20) {
        message = "Must be less than 20 characters";
    }
 
    // tetsing if the inputted password matches the pattern - returns either true or false
    const isValid = passwordRegex.test(passwordValue);
 
    //setting the styles based on validty and the custom messages
    setErrorStyles(passwordInput, passwordErrorMssg, passwordErrorIcon, message, isValid);
 
    //returning isValid to use later upon handling submission
    return isValid;
}
 
//validates whether the passwords match
function validatePasswordMatch(passwordInput, passwordInputConfirm) {
    console.log("check password match");
    // for accesing error messages and icons
    const passwordErrorIcon = document.querySelector("#error_icon_password2");
    const passwordErrorMssg = document.querySelector("#error_message_password2");
 
 
    const passwordValue1 = passwordInput.value;
    const passwordValue2 = passwordInputConfirm.value;
    //checking if the password from first input field matches the second one, and storing in isValid
    const isValid = passwordValue1 === passwordValue2;
 
    console.log(isValid);
 
    // adds or removes validations styling based on whether the passwords match
    setErrorStyles(passwordInputConfirm, passwordErrorMssg, passwordErrorIcon, "Passwords do not match", isValid);
 
    //returning isValid to use later upon handling submission
    return isValid;
}
 
//fetching user data from the user_db and checking the inputted email against emails already in there
async function checkExistingEmail(email) {
    try {
        const response = await fetch(user_db);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        const users = await response.json();
        return users.some(user => user.email === email);
    } catch (error) {
        console.error(error.message);
        return false;
    }
}
 
 
// Fetching user data from the user_db and checking if the email and password match
async function checkUserCredentials(email, password) {
    try {
        const response = await fetch(user_db);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        const users = await response.json();
        return users.some(user => user.email === email && user.password === password);
    } catch (error) {
        console.error(error.message);
        return false;
    }
}
 
//function responsible for adding the user's information
async function addUserToDatabase(email, password) {
    const user = {
        email: email,
        password: password,
    };
 
    const response = await fetch(user_db, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
 
    if (!response.ok) {
        throw new Error("Adding the new user failed");
    }
 
    const data = await response.json();
    console.log("Signup successful!");
 
}
 
export {
    setErrorStyles,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    checkExistingEmail,
    checkUserCredentials,
    addUserToDatabase
};