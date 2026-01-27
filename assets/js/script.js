document.addEventListener('DOMContentLoaded', () => {
    // Hamburger toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Feature hover animations (for touch devices too)
    const features = document.querySelectorAll('.feature-item');
    features.forEach(f => {
        f.addEventListener('mouseenter', () => {
            f.style.transform = 'translateY(-5px)';
            f.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        f.addEventListener('mouseleave', () => {
            f.style.transform = 'translateY(0)';
            f.style.boxShadow = 'none';
        });
    });
});




const slides = document.querySelectorAll('#heroSlider input[type="radio"]');
let index = 0;

setInterval(() => {
  slides[index].checked = false;
  index = (index + 1) % slides.length;
  slides[index].checked = true;
}, 5000);







// people


// function copyEmail(email) {
//     navigator.clipboard.writeText(email).then(() => {
//         alert("Email copied: " + email);
//     });
// }



function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('copy-toast');

        toast.textContent = `Email copied: ${email}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    });
}















