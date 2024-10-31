

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