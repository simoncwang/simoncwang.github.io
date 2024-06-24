

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
    document.getElementById("expandBtn").style.top=document.getElementById("topnav").offsetHeight;
}