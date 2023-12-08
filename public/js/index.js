document.getElementById("image").addEventListener("click", function() {
    var dropdownMenu = document.getElementById("dropdown-menu");
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "block";
    }
  });
  
  // Close the dropdown menu if the user clicks outside of it
  window.addEventListener("click", function(event) {
    var dropdownMenu = document.getElementById("dropdown-menu");
    var image = document.getElementById("image");
    if (event.target !== dropdownMenu && event.target !== image) {
      dropdownMenu.style.display = "none";
    }
  });
  