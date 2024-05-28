"use strict";

// Add the missing functions
function getUserFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function toggleUserFavorite(recipeId, heartIcon) {
    let favorites = getUserFavorites();
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(fav => fav !== recipeId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    } else {
        favorites.push(recipeId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Existing functions
const user_db = "http://localhost:3000/users";

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

function validateEmail(emailInput) {
    const emailErrorIcon = document.querySelector("#error_icon_email");
    const emailErrorMssg = document.querySelector("#error_message_email");

    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    const emailValue = emailInput.value;

    const isValid = emailRegex.test(emailValue);
    setErrorStyles(emailInput, emailErrorMssg, emailErrorIcon, "Please enter a valid email", isValid);

    return isValid;
}

function validatePassword(passwordInput) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,20}$/;

    const passwordErrorIcon = document.querySelector("#error_icon_password");
    const passwordErrorMssg = document.querySelector("#error_message_password");

    const passwordValue = passwordInput.value;

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

    const isValid = passwordRegex.test(passwordValue);
    setErrorStyles(passwordInput, passwordErrorMssg, passwordErrorIcon, message, isValid);

    return isValid;
}

function validatePasswordMatch(passwordInput, passwordInputConfirm) {
    const passwordErrorIcon = document.querySelector("#error_icon_password2");
    const passwordErrorMssg = document.querySelector("#error_message_password2");

    const passwordValue1 = passwordInput.value;
    const passwordValue2 = passwordInputConfirm.value;
    const isValid = passwordValue1 === passwordValue2;

    setErrorStyles(passwordInputConfirm, passwordErrorMssg, passwordErrorIcon, "Passwords do not match", isValid);

    return isValid;
}

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
}

export {
    setErrorStyles,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    checkExistingEmail,
    checkUserCredentials,
    addUserToDatabase,
    getUserFavorites,
    toggleUserFavorite
};
