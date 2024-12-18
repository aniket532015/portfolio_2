// const menubar = document.querySelector('#menu');
// const Navbar = document.querySelector('.navbar');
// menubar.onclick=()=>{
//     menubar.classList.toggle('bx-x');
//     Navbar.classList.toggle('active')
// }
// const section=document.querySelectorAll('section');
// const navlink = document.querySelectorAll('header nav a')
// window.onscroll = ()=>{
//     section.forEach(sec=>{
//         let top = window.scrollY;
//         let offset = sec.offsetTop - 150;
//         let height = sec.offsetHeight;
//         let id = sec.getAttribute('id')
//         if(top>offset && top < offset + height){
//             sec.classList.add('start-animation');
//             navlink.forEach(links=>{
//                 links.classList.remove('active')
//                 document.querySelector('header nav a[href*='+id+']').classList.add('active')
              
//             })
//         }
//     })
//     var header = document.querySelector('.header');
//     header.classList.toggle('sticky',window.scrollY>100)
//     menubar.classList.remove('bx-x');
//     Navbar.classList.remove('active')
// } 


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
        const context = this, args = arguments;
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

