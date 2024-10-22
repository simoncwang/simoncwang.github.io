

function openNav() {
    document.getElementById("mySidenav").style.top=document.getElementById("topnav").offsetHeight;
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("myContent").style.marginLeft = "200px";
    document.getElementById("expandBtn").style.display = "none";
}
  
function closeNav() {
    
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myContent").style.marginLeft = "0%";
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
    btn = document.getElementById("blog-home-btn");
    if (nextID == "thumbnails") {
        divs = document.querySelectorAll(`div.${"blog-content"}`);
        btn = document.querySelectorAll(`div.${"blog-content.blog-home-btn"}`);
    
        // Loop through each div and set display to none
        divs.forEach(div => {
            div.style.display = 'none';
        });
        btn.style.display = "none";
    } else {
        btn.style.display = "block";
    }
    
    
}