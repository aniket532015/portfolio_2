// *************************Preloader with Lottie Animation*************************
// To change the animation, simply replace the 'path' URL below with any animation from:
// https://lottiefiles.com/featured
//
// How to use a custom animation:
// 1. Go to https://lottiefiles.com/
// 2. Find an animation you like
// 3. Click on it and copy the Lottie JSON URL
// 4. Replace the path below with your new URL
// *********************************************************************************

window.addEventListener('load', function() {
    // Initialize Lottie animation
    const animation = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // Professional loading animation - Choose one:

        // Option 1: Professional loading spinner (current - clean and modern)
        // path: 'https://assets9.lottiefiles.com/packages/lf20_poqmycwy.json'

        // Alternative animations (uncomment to use):
        // Option 2: Coding/Developer animation
        path: 'https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json'

        // Option 3: Cloud computing animation (great for DevOps)
        // path: 'https://assets4.lottiefiles.com/packages/lf20_khzniaya.json'

        // Option 4: Rocket launch animation
        // path: 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json'

        // Option 5: Gear/Settings animation (tech-focused)
        // path: 'https://assets10.lottiefiles.com/packages/lf20_myejiggj.json'
    });

    // Hide preloader after minimum display time
    const preloader = document.querySelector('.preloader');
    const minimumLoadTime = 3000; // Adjust this value (in milliseconds) to show loader longer/shorter

    setTimeout(() => {
        preloader.classList.add('fade-out');
        // Remove from DOM after fade animation
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, minimumLoadTime);
});

// *************************Navbar and Navigation*************************
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
