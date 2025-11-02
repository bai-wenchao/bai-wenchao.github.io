document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');

      // Animate the hamburger menu
      const spans = navToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.style.transform = navMenu.classList.contains('active')
          ? getTransformForIndex(index, true)
          : getTransformForIndex(index, false);
      });
    });
  }

  function getTransformForIndex(index, isActive) {
    switch(index) {
      case 0:
        return isActive ? 'rotate(45deg) translate(5px, 5px)' : 'none';
      case 1:
        return isActive ? 'opacity: 0' : 'none';
      case 2:
        return isActive ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
      default:
        return 'none';
    }
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          const spans = navToggle.querySelectorAll('span');
          spans.forEach((span, index) => {
            span.style.transform = getTransformForIndex(index, false);
          });
        }
      }
    });
  });

  // Add active state to navigation based on scroll position
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update active nav link
        document.querySelectorAll('.nav-menu a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});

// Add Font Awesome for social icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);