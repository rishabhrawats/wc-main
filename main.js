(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight

      if (!header.classList.contains('header-scrolled')) {
        offset -= 24
      }

      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
      }
    }, true)

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
        e.preventDefault()

        let navbar = select('#navbar')
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile')
          let navbarToggle = select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        scrollto(this.hash)
      }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });

        let portfolioFilters = select('#portfolio-flters li', true);

        on('click', '#portfolio-flters li', function(e) {
          e.preventDefault();
          portfolioFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          portfolioIsotope.on('arrangeComplete', function() {
            AOS.refresh()
          });
        }, true);
      }

    });

    /**
     * Initiate portfolio lightbox 
     */
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });

    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });

    /**
     * Testimonials slider
     */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40
        },

        1200: {
          slidesPerView: 3,
        }
      }
    });

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
      });
    });

    /**
     * Initiate Pure Counter 
     */
    new PureCounter();

  })()

  document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        const icon = question.querySelector("i");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all other FAQ answers
            faqItems.forEach((faq) => {
                faq.classList.remove("active");
                faq.querySelector(".faq-answer").style.maxHeight = null;
                faq.querySelector(".faq-question i").classList.replace("fa-minus", "fa-plus");
            });

            // Toggle the clicked FAQ item
            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.classList.replace("fa-plus", "fa-minus");
            } else {
                item.classList.remove("active");
                answer.style.maxHeight = null;
                icon.classList.replace("fa-minus", "fa-plus");
            }
        });
    });
});



document.addEventListener('DOMContentLoaded', function() {
  // Only initialize on devices with fine pointer (mouse)
  if (matchMedia('(pointer: fine)').matches) {
    initChevronCursor();
  }
});

function initChevronCursor() {
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'cursor-chevron';
  document.body.appendChild(cursor);
  
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(follower);
  
  // Mouse position tracking
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  
  // Smoothing factor (lower = smoother but slower)
  const cursorSmoothness = 0.1;
  const followerSmoothness = 0.05;
  
  // Animation loop
  function animate() {
    // Main cursor (direct follow)
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Follower (smooth delayed follow)
    followerX += (mouseX - followerX) * followerSmoothness;
    followerY += (mouseY - followerY) * followerSmoothness;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    
    requestAnimationFrame(animate);
  }
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Interactive elements
  const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', '[data-cursor-hover]'];
  
  document.addEventListener('mouseover', (e) => {
    if (interactiveElements.some(selector => 
      e.target.matches(selector) || 
      e.target.closest(selector)
    )) {
      document.body.classList.add('cursor-active');
      follower.style.width = '30px';
      follower.style.height = '30px';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (interactiveElements.some(selector => 
      e.target.matches(selector) || 
      e.target.closest(selector)
    )) {
      document.body.classList.remove('cursor-active');
      follower.style.width = '40px';
      follower.style.height = '40px';
    }
  });
  
  // Click effect
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });
  
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
  
  // Start animation
  animate();
}
























document.addEventListener('DOMContentLoaded', () => {
  const bubblesContainer = document.querySelector('.industry-bubbles');
  const waterLayer = document.querySelector('.water-layer');
  const rippleContainer = document.querySelector('.ripple-container');
  
  const industries = [
      { name: "Healthcare", icon: "hospital", color: "#3b82f6" },
      { name: "Sport Tech", icon: "running", color: "#ef4444" },
      { name: "Social", icon: "users", color: "#8b5cf6" },
      { name: "Gamification", icon: "gamepad", color: "#ec4899" },
      { name: "Logistics", icon: "truck", color: "#f59e0b" },
      { name: "Entertainment", icon: "film", color: "#10b981" },
      { name: "Solar", icon: "solar-panel", color: "#f97316" },
      { name: "News", icon: "newspaper", color: "#06b6d4" },
      { name: "Consultancy", icon: "briefcase", color: "#64748b" },
      { name: "Fintech", icon: "chart-line", color: "#14b8a6" },
      { name: "Shopping", icon: "shopping-bag", color: "#d946ef" },
      { name: "Education", icon: "graduation-cap", color: "#0ea5e9" },
      { name: "Mining", icon: "hammer", color: "#a855f7" }
  ];

  // Create industry tags
  industries.forEach((industry, index) => {
      const tag = document.createElement('div');
      tag.className = 'industry-tag';
      tag.style.animation = `tagEntrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s forwards`;
      tag.style.opacity = '0';
      tag.innerHTML = `
          <i class="fas fa-${industry.icon}"></i>
          <span>${industry.name}</span>
      `;
      tag.dataset.color = industry.color;
      bubblesContainer.appendChild(tag);
      
      // Add interaction effects
      setupTagInteractions(tag);
  });

  // Create floating bubbles
  function createBubbles() {
      for (let i = 0; i < 15; i++) {
          setTimeout(() => {
              const bubble = document.createElement('div');
              bubble.className = 'bubble';
              
              // Random bubble properties
              const size = Math.random() * 25 + 5;
              const duration = Math.random() * 15 + 10;
              const delay = Math.random() * 5;
              const left = Math.random() * 100;
              const opacity = Math.random() * 0.5 + 0.3;
              
              bubble.style.width = `${size}px`;
              bubble.style.height = `${size}px`;
              bubble.style.left = `${left}%`;
              bubble.style.bottom = `-${size}px`;
              bubble.style.animationDuration = `${duration}s`;
              bubble.style.animationDelay = `${delay}s`;
              bubble.style.opacity = opacity;
              
              waterLayer.appendChild(bubble);
              
              // Remove bubble after animation
              setTimeout(() => {
                  bubble.remove();
              }, duration * 1000);
          }, i * 300);
      }
  }

  // Setup tag interactions
  function setupTagInteractions(tag) {
      // Press effect
      const pressTag = () => {
          tag.style.transform = 'translateY(2px) scale(0.96)';
          tag.style.boxShadow = '0 2px 5px rgba(2, 132, 199, 0.2)';
      };
      
      // Release effect
      const releaseTag = () => {
          tag.style.transform = 'translateY(-8px) scale(1.05)';
          tag.style.boxShadow = '0 8px 25px rgba(2, 132, 199, 0.3)';
          setTimeout(() => {
              if (!tag.matches(':hover')) {
                  tag.style.transform = '';
                  tag.style.boxShadow = '';
              }
          }, 300);
      };
      
      // Mouse events
      tag.addEventListener('mousedown', pressTag);
      tag.addEventListener('mouseup', releaseTag);
      tag.addEventListener('mouseleave', () => {
          tag.style.transform = '';
          tag.style.boxShadow = '';
      });
      
      // Touch events
      tag.addEventListener('touchstart', (e) => {
          e.preventDefault();
          pressTag();
      }, { passive: false });
      
      tag.addEventListener('touchend', releaseTag);
      
      // Click effect
      tag.addEventListener('click', createRipple);
  }

  // Create ripple effect
  function createRipple(e) {
      const tag = e.currentTarget;
      const rect = tag.getBoundingClientRect();
      
      // Get click position
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      
      // Create ripple
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
      ripple.style.left = `${x - rect.left - ripple.offsetWidth/2}px`;
      ripple.style.top = `${y - rect.top - ripple.offsetHeight/2}px`;
      ripple.style.backgroundColor = tag.dataset.color || '#38bdf8';
      
      rippleContainer.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
          ripple.remove();
      }, 600);
      
      console.log('Selected:', tag.textContent.trim());
  }

  // Water parallax effect
  const moveWater = (e) => {
      const x = (e.clientX || e.touches[0].clientX) / window.innerWidth;
      const y = (e.clientY || e.touches[0].clientY) / window.innerHeight;
      waterLayer.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
  };
  
  document.addEventListener('mousemove', moveWater);
  document.addEventListener('touchmove', moveWater);

  // Initialize bubbles and auto-create
  createBubbles();
  setInterval(createBubbles, 3000);
});














particlesJS("particles-js", {
  "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#ffffff" },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5, "random": true },
      "size": { "value": 3, "random": true },
      "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
      "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
  },
  "interactivity": {
      "detect_on": "canvas",
      "events": {
          "onhover": { "enable": true, "mode": "repulse" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
      }
  }
});














// Enhanced Quote Form Functionality



document.addEventListener('DOMContentLoaded', function() {
  const requestQuoteBtn = document.getElementById('requestQuoteBtn');
  const popupOverlay = document.getElementById('popupOverlay');
  
  if (requestQuoteBtn && popupOverlay) {
    // Form Elements
    const closePopupBtn = document.getElementById('closePopup');
    const quotationForm = document.getElementById('quotationForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnNextList = document.querySelectorAll('.btn-next');
    const btnPrevList = document.querySelectorAll('.btn-prev');
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    const otherServiceGroup = document.getElementById('otherServiceGroup');
    const submitBtn = document.querySelector('.btn-submit');
    const submitText = document.querySelector('.submit-text');
    const loader = document.querySelector('.loader');
    
    // Open popup
    requestQuoteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.overflow = 'hidden';
      popupOverlay.classList.add('active');
    });
    
    // Close popup
    function closePopup() {
      document.body.style.overflow = 'auto';
      popupOverlay.classList.remove('active');
    }
    
    closePopupBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) closePopup();
    });
    
    // Form Navigation
    let currentStep = 0;
    
    function showStep(stepIndex) {
      formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
      });
      
      progressSteps.forEach((step, index) => {
        step.classList.toggle('active', index <= stepIndex);
      });
      
      currentStep = stepIndex;
    }
    
    btnNextList.forEach(btn => {
      btn.addEventListener('click', function() {
        // Validate current step before proceeding
        const currentStepForm = formSteps[currentStep];
        const inputs = currentStepForm.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
          } else {
            input.classList.remove('error');
          }
        });
        
        if (isValid) {
          if (currentStep < formSteps.length - 1) {
            showStep(currentStep + 1);
          }
        } else {
          // Add shake animation to indicate error
          currentStepForm.style.animation = 'shake 0.5s';
          setTimeout(() => {
            currentStepForm.style.animation = '';
          }, 500);
        }
      });
    });
    
    btnPrevList.forEach(btn => {
      btn.addEventListener('click', function() {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      });
    });
    
    // Service selection
    serviceRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        otherServiceGroup.style.display = this.value === 'other' ? 'block' : 'none';
      });
    });
    
    // Form submission
    if (quotationForm) {
      quotationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitText.textContent = 'Processing...';
        loader.style.display = 'block';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual form submission)
        setTimeout(() => {
          // Get form data
          const formData = {
            company: document.getElementById('company').value,
            contact: document.getElementById('contact').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.querySelector('input[name="service"]:checked')?.value,
            otherService: document.querySelector('input[name="service"]:checked')?.value === 'other' 
                          ? document.getElementById('otherService').value 
                          : null,
            budget: document.getElementById('budget').value,
            timeline: document.getElementById('timeline').value,
            description: document.getElementById('description').value
          };
          
          console.log('Form submitted:', formData);
          
          // Show success message
          alert('Thank you for your request! Our team will contact you within 24 hours.');
          
          // Reset form and close popup
          quotationForm.reset();
          closePopup();
          
          // Reset submit button
          submitText.textContent = 'Submit Request';
          loader.style.display = 'none';
          submitBtn.disabled = false;
          showStep(0); // Return to first step
        }, 1500);
      });
    }
    
    // Input validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('error');
      });
    });
  }
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);






















// /**

// */
// (function() {
//   "use strict";

//   /**
//    * Easy selector helper function
//    */
//   const select = (el, all = false) => {
//     el = el.trim()
//     if (all) {
//       return [...document.querySelectorAll(el)]
//     } else {
//       return document.querySelector(el)
//     }
//   }

//   /**
//    * Easy event listener function
//    */
//   const on = (type, el, listener, all = false) => {
//     let selectEl = select(el, all)
//     if (selectEl) {
//       if (all) {
//         selectEl.forEach(e => e.addEventListener(type, listener))
//       } else {
//         selectEl.addEventListener(type, listener)
//       }
//     }
//   }

//   /**
//    * Easy on scroll event listener 
//    */
//   const onscroll = (el, listener) => {
//     el.addEventListener('scroll', listener)
//   }

//   /**
//    * Navbar links active state on scroll
//    */
//   let navbarlinks = select('#navbar .scrollto', true)
//   const navbarlinksActive = () => {
//     let position = window.scrollY + 200
//     navbarlinks.forEach(navbarlink => {
//       if (!navbarlink.hash) return
//       let section = select(navbarlink.hash)
//       if (!section) return
//       if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
//         navbarlink.classList.add('active')
//       } else {
//         navbarlink.classList.remove('active')
//       }
//     })
//   }
//   window.addEventListener('load', navbarlinksActive)
//   onscroll(document, navbarlinksActive)

//   /**
//    * Scrolls to an element with header offset
//    */
//   const scrollto = (el) => {
//     let header = select('#header')
//     let offset = header.offsetHeight

//     if (!header.classList.contains('header-scrolled')) {
//       offset -= 24
//     }

//     let elementPos = select(el).offsetTop
//     window.scrollTo({
//       top: elementPos - offset,
//       behavior: 'smooth'
//     })
//   }

//   /**
//    * Toggle .header-scrolled class to #header when page is scrolled
//    */
//   let selectHeader = select('#header')
//   if (selectHeader) {
//     const headerScrolled = () => {
//       if (window.scrollY > 100) {
//         selectHeader.classList.add('header-scrolled')
//       } else {
//         selectHeader.classList.remove('header-scrolled')
//       }
//     }
//     window.addEventListener('load', headerScrolled)
//     onscroll(document, headerScrolled)
//   }

//   /**
//    * Back to top button
//    */
//   let backtotop = select('.back-to-top')
//   if (backtotop) {
//     const toggleBacktotop = () => {
//       if (window.scrollY > 100) {
//         backtotop.classList.add('active')
//       } else {
//         backtotop.classList.remove('active')
//       }
//     }
//     window.addEventListener('load', toggleBacktotop)
//     onscroll(document, toggleBacktotop)
//   }

//   /**
//    * Mobile nav toggle
//    */
//   on('click', '.mobile-nav-toggle', function(e) {
//     select('#navbar').classList.toggle('navbar-mobile')
//     this.classList.toggle('bi-list')
//     this.classList.toggle('bi-x')
//   })

//   /**
//    * Mobile nav dropdowns activate
//    */
//   on('click', '.navbar .dropdown > a', function(e) {
//     if (select('#navbar').classList.contains('navbar-mobile')) {
//       e.preventDefault()
//       this.nextElementSibling.classList.toggle('dropdown-active')
//     }
//   }, true)

//   /**
//    * Scrool with ofset on links with a class name .scrollto
//    */
//   on('click', '.scrollto', function(e) {
//     if (select(this.hash)) {
//       e.preventDefault()

//       let navbar = select('#navbar')
//       if (navbar.classList.contains('navbar-mobile')) {
//         navbar.classList.remove('navbar-mobile')
//         let navbarToggle = select('.mobile-nav-toggle')
//         navbarToggle.classList.toggle('bi-list')
//         navbarToggle.classList.toggle('bi-x')
//       }
//       scrollto(this.hash)
//     }
//   }, true)

//   /**
//    * Scroll with ofset on page load with hash links in the url
//    */
//   window.addEventListener('load', () => {
//     if (window.location.hash) {
//       if (select(window.location.hash)) {
//         scrollto(window.location.hash)
//       }
//     }
//   });

//   /**
//    * Porfolio isotope and filter
//    */
//   window.addEventListener('load', () => {
//     let portfolioContainer = select('.portfolio-container');
//     if (portfolioContainer) {
//       let portfolioIsotope = new Isotope(portfolioContainer, {
//         itemSelector: '.portfolio-item',
//         layoutMode: 'fitRows'
//       });

//       let portfolioFilters = select('#portfolio-flters li', true);

//       on('click', '#portfolio-flters li', function(e) {
//         e.preventDefault();
//         portfolioFilters.forEach(function(el) {
//           el.classList.remove('filter-active');
//         });
//         this.classList.add('filter-active');

//         portfolioIsotope.arrange({
//           filter: this.getAttribute('data-filter')
//         });
//         portfolioIsotope.on('arrangeComplete', function() {
//           AOS.refresh()
//         });
//       }, true);
//     }

//   });

//   /**
//    * Initiate portfolio lightbox 
//    */
//   const portfolioLightbox = GLightbox({
//     selector: '.portfolio-lightbox'
//   });

//   /**
//    * Portfolio details slider
//    */
//   new Swiper('.portfolio-details-slider', {
//     speed: 400,
//     loop: true,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false
//     },
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       clickable: true
//     }
//   });

//   /**
//    * Testimonials slider
//    */
//   new Swiper('.testimonials-slider', {
//     speed: 600,
//     loop: true,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false
//     },
//     slidesPerView: 'auto',
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       clickable: true
//     },
//     breakpoints: {
//       320: {
//         slidesPerView: 1,
//         spaceBetween: 40
//       },

//       1200: {
//         slidesPerView: 3,
//       }
//     }
//   });

//   /**
//    * Animation on scroll
//    */
//   window.addEventListener('load', () => {
//     AOS.init({
//       duration: 1000,
//       easing: "ease-in-out",
//       once: true,
//       mirror: false
//     });
//   });

//   /**
//    * Initiate Pure Counter 
//    */
//   new PureCounter();

// })()

// document.addEventListener("DOMContentLoaded", function () {
//   const faqItems = document.querySelectorAll(".faq-item");

//   faqItems.forEach((item) => {
//       const question = item.querySelector(".faq-question");
//       const icon = question.querySelector("i");

//       question.addEventListener("click", () => {
//           // Toggle active class
//           item.classList.toggle("active");

//           // Toggle icon between + and -
//           if (item.classList.contains("active")) {
//               icon.classList.replace("fa-plus", "fa-minus");
//           } else {
//               icon.classList.replace("fa-minus", "fa-plus");
//           }
//       });
//   });
// });

