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

// BibTeX copy functionality
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // Prevent scrolling to bottom
  document.body.appendChild(textarea);

  try {
    // Select and copy text
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      // Show success message
      showNotification('BibTeX copied to clipboard!');
    } else {
      // Fallback for modern browsers
      navigator.clipboard.writeText(text).then(() => {
        showNotification('BibTeX copied to clipboard!');
      }).catch(() => {
        showNotification('Failed to copy BibTeX');
      });
    }
  } catch (err) {
    document.body.removeChild(textarea);
    // Fallback for modern browsers
    navigator.clipboard.writeText(text).then(() => {
      showNotification('BibTeX copied to clipboard!');
    }).catch(() => {
      showNotification('Failed to copy BibTeX');
    });
  }
}

// Show notification message
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 1000;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;

  // Add animation keyframes if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// Initialize abstract folding functionality
document.addEventListener('DOMContentLoaded', function() {
  // Original mobile navigation and other functionality
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

  // Initialize abstract folding
  initializeAbstractFolding();

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

function initializeAbstractFolding() {
  const publicationItems = document.querySelectorAll('.publication-item');

  publicationItems.forEach(item => {
    const abstract = item.querySelector('.publication-abstract');
    if (abstract) {
      // Create toggle button
      const toggleButton = document.createElement('button');
      toggleButton.className = 'abstract-toggle btn btn-small';
      toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> Show Abstract';

      // Insert toggle button before the abstract
      abstract.parentNode.insertBefore(toggleButton, abstract);

      // Set initial state - hide abstract
      abstract.style.display = 'none';
      abstract.classList.add('abstract-content');

      // Add toggle functionality
      let isExpanded = false;
      toggleButton.addEventListener('click', function() {
        isExpanded = !isExpanded;

        if (isExpanded) {
          abstract.style.display = 'block';
          toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Abstract';
        } else {
          abstract.style.display = 'none';
          toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> Show Abstract';
        }
      });
    }
  });
}

// Add Font Awesome for social icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);