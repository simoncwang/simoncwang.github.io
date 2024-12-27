

function openNav() {
    document.getElementById("mySidenav").style.top=document.getElementById("topnav").offsetHeight;
    document.getElementById("mySidenav").style.width = "15%";
    document.getElementById("expandBtn").style.display = "none";
}
  
function closeNav() {
    
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("expandBtn").style.display = "block";
    // document.getElementById("expandBtn").style.top=document.getElementById("topnav").offsetHeight;
}

function toggleSection(sectionId) {
    var section = document.getElementById(sectionId);
    var currentDisplay = window.getComputedStyle(section).display;

    if (currentDisplay === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

function switchContent(currentID, nextID) {
    var curr = document.getElementById(currentID);
    var next = document.getElementById(nextID);
    if (curr) {
        curr.style.display = "none";
    }

    if (next) {
        next.style.display = "block";
    }

    // if we are switching back to the thumbnails page, make the back to blog button invisible and make all posts invisible
    homebtns = document.getElementsByClassName("blog-home");

    

    // if returning to thumbnails make all content invisible and make all buttons invisible
    if (nextID == "thumbnails") {
        divs = document.querySelectorAll(`div.${"blog-content"}`);
    
        // Loop through each div and set display to none
        divs.forEach(div => {
            div.style.display = 'none';
        });
        
        homebtns.forEach(div => {
            div.style.display = 'none';
        });
        
    } else {
        // get button with the correct ID
        // when switching to a content page, the ID will be appended to the button ID
        btn_id = "blog-home-" + nextID;
        btn = document.getElementById(btn_id)
        btn.style.display = "block";
    }
}



  
// // Apply animation logic when dom loaded
// document.addEventListener('DOMContentLoaded', function() {
//     const toggleRipple = document.getElementById('toggle-ripple');
//     const toggleParticle = document.getElementById('toggle-particle');

//     // Ensure only one checkbox is checked at a time
//     toggleRipple.addEventListener('change', function() {
//         if (toggleRipple.checked) {
//             toggleParticle.checked = false; // Uncheck the other checkbox
//         }
//     });

//     toggleParticle.addEventListener('change', function() {
//         if (toggleParticle.checked) {
//             toggleRipple.checked = false; // Uncheck the other checkbox
//         }
//     });

//     let lastRippleTime = 0;
//     const rippleDelay = 5;

//     // adding animations to mousemovenet
//     document.addEventListener('mousemove', function(e) {
//         if (toggleRipple.checked) {
//             const currentTime = Date.now();
//             if (currentTime - lastRippleTime > rippleDelay) {
//                 animateRipple(e.pageX, e.pageY);
//                 lastRippleTime = currentTime; // Update the last ripple time
//             }
//         }
        
//         if (toggleParticle.checked) {
//             animateParticle(e.pageX, e.pageY);
//         }
        
//     });

//     function animateRipple(x, y) {
//         // Create a new ripple element
//         const ripple = document.createElement('div');
//         ripple.classList.add('ripple');
        
//         // Set the initial position of the ripple at the cursor
//         ripple.style.left = `${x - 20}px`; // Center the ripple around the cursor
//         ripple.style.top = `${y - 20}px`; // Center the ripple around the cursor

//         // Set the size of the ripple
//         const size = Math.random() * 20 + 20; // Random size for variety (min 60px, max 100px)
//         ripple.style.width = `${size}px`;
//         ripple.style.height = `${size}px`;

//         // Add the ripple to the body element
//         document.body.appendChild(ripple);

//         // Remove the ripple after animation ends
//         setTimeout(() => {
//             ripple.remove();
//         }, 2000); // Matches the duration of the animation
//     }

//     function animateParticle(x, y) {
//         // Create a new particle element
//         const particle = document.createElement('div');
//         particle.classList.add('particle');
        
//         // Randomize the movement of the particle
//         const dx = (Math.random() - 0.5) * 100; // Random horizontal drift
//         const dy = (Math.random() - 0.5) * 100; // Random vertical drift
        
//         // Set custom CSS properties for the particle movement
//         particle.style.setProperty('--dx', `${dx}px`);
//         particle.style.setProperty('--dy', `${dy}px`);

//         // Set the initial position of the particle at the cursor
//         particle.style.left = `${x - 5}px`; // Subtract half of the particle's size to center it
//         particle.style.top = `${y - 5}px`;

//         // Add the particle to the particles container
//         document.body.appendChild(particle);

//         // Remove the particle after animation ends
//         setTimeout(() => {
//             particle.remove();
//         }, 1500); // Matches the duration of the animation
//     }
// });




// // blur elements in the edge of the screen
// document.addEventListener("DOMContentLoaded", () => {
//     const elements = document.querySelectorAll('.fade');
//     const viewportHeight = window.innerHeight;
  
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             const rect = entry.boundingClientRect;
//             // Calculate the visible portion of the element inside the viewport
//             const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
//             const visiblePercentage = Math.max(0, Math.min(1, visibleHeight / viewportHeight));
//             console.log(visiblePercentage);
//             if (visiblePercentage > 0.2) {
//                 entry.target.style.opacity = '1';
//             } else if (visiblePercentage > 0) {
//                 entry.target.style.opacity = visiblePercentage * 2;
//             } else {
//                 entry.target.style.opacity = '0';
//             }
//         });
//     }, {
//       root: null, // Viewport
//       threshold: [0, 0.1, 0.3, 0.6, 1.0], // Multiple thresholds for smooth opacity
//       rootMargin: "-20% 0% -20% 0%" // Central visible range
//     });
  
//     // Observe all fade elements
//     elements.forEach(el => observer.observe(el));
//   });
  
