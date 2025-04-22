

const menubar = document.querySelector('#menu');
const Navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('.header');

// Navbar toggle
menubar.onclick = () => {
    menubar.classList.toggle('bx-x');
    Navbar.classList.toggle('active');
};

// Debounce function to optimize scroll performance
function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function () {
        const context = this,args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Scroll event handler
function handleScroll() {
    const top = window.scrollY;

    // Sticky header
    header.classList.toggle('sticky', top > 100);

    // Section animations
    sections.forEach((section) => {
        const offset = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (top > offset && top < offset + height) {
            section.classList.add('start-animation');
            navLinks.forEach((link) => link.classList.remove('active'));
            const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Add scroll event listener with debounce
window.addEventListener('scroll', debounce(handleScroll));


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData.entries());

        fetch('http://43.204.89.233:9091/send-email', {
        // fetch('http://aniket.uk:9091/send-email', {
    
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send the message.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            alert('Failed to send the message.');
        });
    });
});
