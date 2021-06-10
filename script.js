var currentActiveNode = null;
var currentImageIndex = 0;

var makeInt = function (value) {
  if(typeof(value)==='string'){ // The value returend is of string type. e.g.12.8px
      value = Number(value.replace(/[^0-9\.]+/g,""));  // This regex expression replaces every character which neither a number nor a decimal point.
  }
  var int = parseInt(value, 10); // This parses the decimal pointer into int with base 10.
  return int;
};

function getLetterSpacing(previewTextHolder){
    // As we have used external .css file thus we need to use window.getComputedStyle and not simple element.style to get value of a property.
    let temp = window.getComputedStyle(previewTextHolder, null).getPropertyValue('letter-spacing'); // This fetches the letter-spacing property.
    if(temp=='normal'){
        temp = 0;
    }else{
        temp = makeInt(temp);
    }
    return temp;
}

function truncate(previewTextHolder, previewText) {
  var numChars = 0;
  let elFontSize = window
    .getComputedStyle(previewTextHolder, null)
    .getPropertyValue("font-size"); // Getting font-size property of the span containing the text

  let temp = getLetterSpacing(previewTextHolder);
  var letterSpace = makeInt(elFontSize) + temp;

  var boxCenter = makeInt(previewTextHolder.scrollWidth) / 2; // Get the width of the span element
  /*
    Logic for deciding number of characters
        We first calculated how much space a character takes.
        Our put string will be of the form 
            x + y + z = width of span;
            where x and z are the lenths of the character at the end and begining and y is the ellipse character.
        Therefore in order to calculate the number of characters at the end and the starting of the string we would run the followinf for loop.
        Now we check if the space taken by letters is greater than the width of the parent span element.
        If yes then we truncate the the string into our format.
  */ 
  for (var l = letterSpace * 2; l < boxCenter; l += letterSpace) {
    numChars = numChars + 1;
  }

  if (
    letterSpace * previewText.length > previewTextHolder.scrollWidth &&
    2 * numChars + 4 < previewText.length
  ) {
    return (
      previewText.substr(0, numChars).trim() +
      "...." +
      previewText.substr(previewText.length - numChars, previewText.length)
    );
  }
  return previewText;
}

window.onload = function () {
  // Waiting for DOM to load
  var previewContainer =
    document.getElementsByClassName("preview-container")[0]; // Select Preview Container

  var imageOutput = document.getElementsByClassName("image-out")[0];
  var imageTitle = document.getElementById("image-out-title");

  for (let image in images) {
    let previewRow = document.createElement("div"); // Used to create an element

    previewRow.setAttribute("class", "preview-row"); // Set Class property
    previewRow.setAttribute("data-image", images[image].previewImage);
    previewRow.setAttribute("data-title", images[image].title);

    previewRow.addEventListener("click", () => {
      // On click logic
      if (currentActiveNode) {
        currentActiveNode.classList.remove("active"); //Add and remove active class to show currently active tab
      }
      imageOutput.style.backgroundImage =
        "url(" + images[image].previewImage + ")"; // set background image of the image-output div
      imageTitle.innerText = images[image].title;
      currentActiveNode = previewRow;
      currentActiveNode.classList.add("active");
      currentImageIndex = Number(image);
    });

    let previewImage = document.createElement("span");
    previewImage.setAttribute("class", "preview-image");
    previewImage.style.backgroundImage =
      "url(" + images[image].previewImage + ")";

    let previewText = document.createElement("span");
    previewText.setAttribute("class", "preview-text");
    previewText.innerText = images[image].title

    previewRow.appendChild(previewImage); // appending out newly created node elements to the DOM parent
    previewRow.appendChild(previewText);
    previewContainer.appendChild(previewRow);

    previewText.innerText = truncate(previewText,images[image].title);
  }

  catchKeyStroke();
};

// Function to facilitate key pressing logic

function catchKeyStroke() {
  var imageOutput = document.getElementsByClassName("image-out")[0];
  let previewRows = document.getElementsByClassName("preview-row");
  var imageTitle = document.getElementById("image-out-title");

  currentActiveNode = previewRows[currentImageIndex];
  imageOutput.style.backgroundImage =
    "url(" + currentActiveNode.getAttribute("data-image") + ")";
  imageTitle.innerText = currentActiveNode.getAttribute("data-title");
  currentActiveNode.classList.add("active");

  document.addEventListener("keydown", (event) => {
    event.preventDefault(); // Preventing any default behaviour of the key

    if (event.key === "ArrowUp") {
      // To handle down key stroke
      currentActiveNode.classList.remove("active");
      currentImageIndex =
        currentImageIndex === 0
          ? images.length - 1
          : Number(currentImageIndex) - 1;
      currentActiveNode = previewRows[currentImageIndex];
      imageOutput.style.backgroundImage =
        "url(" + currentActiveNode.getAttribute("data-image") + ")";
      imageTitle.innerText = currentActiveNode.getAttribute("data-title");
      currentActiveNode.classList.add("active");
    } else if (event.key === "ArrowDown") {
      // To handle up key stroke
      currentActiveNode.classList.remove("active");
      currentImageIndex =
        currentImageIndex === images.length - 1
          ? 0
          : Number(currentImageIndex) + 1;
      currentActiveNode = previewRows[currentImageIndex];
      imageOutput.style.backgroundImage =
        "url(" + currentActiveNode.getAttribute("data-image") + ")";
      imageTitle.innerText = currentActiveNode.getAttribute("data-title");
      currentActiveNode.classList.add("active");
    } else {
      alert("Only Up and Down keys are allowed as input"); // Alerting user to use only up and down keys
    }
  });
}
