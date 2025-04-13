// cursor.js
document.addEventListener('DOMContentLoaded', function() {
    // Only enable for non-touch devices
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      const root = document.documentElement;
      
      // Create cursor elements
      const cursor = document.createElement('div');
      cursor.classList.add('cursor');
      document.body.appendChild(cursor);
  
      const follower = document.createElement('div');
      follower.classList.add('cursor', 'cursor__follower');
      document.body.appendChild(follower);
  
      // Position function (unchanged from your original)
      function setPosition(element, e) {
        element.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
  
      // Mouse move listener (unchanged)
      root.addEventListener('mousemove', function(e) {
        setPosition(follower, e);
        setPosition(cursor, e);
      });
  
      // Handle window resize
      window.addEventListener('resize', function() {
        // This ensures cursors maintain position during resize
        const fakeEvent = {
          clientX: cursor.style.transform.match(/translate3d\((\d+)px/)[1],
          clientY: cursor.style.transform.match(/translate3d\(\d+px, (\d+)px/)[1]
        };
        setPosition(cursor, fakeEvent);
        setPosition(follower, fakeEvent);
      });
    }
  });