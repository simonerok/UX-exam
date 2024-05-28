'use strict';
 
 
 
//logged user and logoout
const logout_btn = document.getElementById('logout');
const user_container = document.querySelector('.login_li');
const logout_container = document.querySelector('.logout_li');
//stores true/false whether a user is logged in
let isLoggedIn;
 
//gets the email of the logged in user from session storage
function getLoggedUser() {
    console.log("login test");
    let loggedUser = sessionStorage.getItem("userLogged");
 
    return loggedUser;
}
 
//returns true or false whether an user is logged in
function isLogged() {
    const loggedUser = getLoggedUser();
 
    if (loggedUser) {
        isLoggedIn = true;
        console.log(loggedUser + " is logged in");
        toggleLogoutButton()
    } else {
        isLoggedIn = false;
        console.log("no user is logged in");
    }
    return isLoggedIn;
}
 
//removes the email from session storage, and sets islogged to false
function logout() {
    console.log("logout");
    isLoggedIn = false;
    sessionStorage.removeItem("userLogged");
    toggleLogoutButton()
    window.location.href="login.html"
}
 
 
 
function toggleLogoutButton(){
    console.log("test");
   
if (isLoggedIn) {
    user_container.classList.add("hidden");
    logout_container.classList.remove("hidden");
    logout_btn.addEventListener("click", logout);
} else if (!isLoggedIn) {
    user_container.classList.remove("hidden");
    logout_container.classList.add("hidden");
}
}
 
getLoggedUser();
isLogged();
toggleLogoutButton();
