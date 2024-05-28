'use strict';

//HEADER//
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const mainMenu = document.getElementById('main-menu');
 
    console.log(navToggle);
    console.log(mainMenu);
   
    navToggle.addEventListener('click', function() {
        mainMenu.classList.toggle('shown');
        if (mainMenu.classList.contains('shown')) {
            navToggle.textContent = '✖';
        } else {
            navToggle.textContent = '☰';
        }
    });
});



