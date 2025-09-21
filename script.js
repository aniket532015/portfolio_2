

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
    const form = document.getElementById('contact-form');
    if (!form) return;
    const submitBtn = form.querySelector('input[type="submit"]');

    function showToast(message, type = 'success', duration = 4200) {
        const container = document.getElementById('toast-container');
        if (!container) { alert(message); return; }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error'}'></i><span>${message}</span><div class=\"bar\"></div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, duration);
    }

    function emailValid(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim()); }
    function phoneValid(v){ const d=(v||'').replace(/[^0-9]/g,''); return d.length>=8 && d.length<=15; }

    function setFieldError(input, msg){
        if (!input) return;
        input.classList.add('input-error','shake');
        input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
        let hint = input.nextElementSibling;
        if (!hint || !hint.classList.contains('field-error')){
            hint = document.createElement('div');
            hint.className = 'field-error';
            input.insertAdjacentElement('afterend', hint);
        }
        hint.textContent = msg;
    }
    function clearFieldError(input){
        if (!input) return;
        input.classList.remove('input-error');
        const hint = input.nextElementSibling;
        if (hint && hint.classList.contains('field-error')) hint.remove();
    }

    ['name','email','phonenumber','subject','message'].forEach(n=>{
        const el = form.querySelector(`[name=\"${n}\"]`);
        if (el) el.addEventListener('input', ()=>clearFieldError(el));
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = form.name?.value?.trim();
        const email = form.email?.value?.trim();
        const phone = form.phonenumber?.value?.trim();
        const subject = form.subject?.value?.trim();
        const message = form.message?.value?.trim();

        let firstInvalid = null;
        if (!name){ firstInvalid = firstInvalid || form.name; setFieldError(form.name,'Please enter your name.'); }
        if (!email || !emailValid(email)){ firstInvalid = firstInvalid || form.email; setFieldError(form.email,'Enter a valid email.'); }
        if (!phone || !phoneValid(phone)){ firstInvalid = firstInvalid || form.phonenumber; setFieldError(form.phonenumber,'Enter a valid phone (8-15 digits).'); }
        if (!subject){ firstInvalid = firstInvalid || form.subject; setFieldError(form.subject,'Subject is required.'); }
        if (!message){ firstInvalid = firstInvalid || form.message; setFieldError(form.message,'Please write a message.'); }

        if (firstInvalid){
            firstInvalid.focus();
            showToast('Please fix the highlighted fields.', 'error', 4800);
            return;
        }

        const formObject = { name, email, phonenumber: phone, subject, message };

        // loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.original = submitBtn.value;
            submitBtn.value = 'Sending...';
            submitBtn.classList.add('loading');
        }

        fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
        })
        .then(response => { if (!response.ok) throw new Error('Failed'); return response.json(); })
        .then(data => {
            showToast(data.message || 'Message sent successfully!', 'success', 4200);
            form.reset();
            if (submitBtn){
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitBtn.value = 'Sent!';
                setTimeout(()=>{
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    submitBtn.value = submitBtn.dataset.original || 'Send Message';
                }, 1200);
            }
        })
        .catch(error => {
            console.error('Contact form error:', error);
            showToast('Failed to send the message.', 'error', 5200);
        })
        .finally(() => {
            if (submitBtn && !submitBtn.classList.contains('success')){
                submitBtn.disabled = false;
                submitBtn.value = submitBtn.dataset.original || 'Send Message';
                submitBtn.classList.remove('loading');
            }
        });
    });
});
