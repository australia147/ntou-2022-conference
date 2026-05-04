// ===== Mobile nav toggle =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// ===== Scroll fade-up animation =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ===== Navbar shadow on scroll =====
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    if (window.scrollY > 8) {
      navbar.classList.add('shadow-md', 'bg-white/95');
      navbar.classList.remove('bg-white/80');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white/80');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
