var currentActiveNode = null;
var currentImageIndex = 0;

var makeInt = function (value) {
  if(typeof(value)==='string'){
      value = Number(value.replace(/[^0-9\.]+/g,""));
  }
  var int = parseInt(value, 10);
  return int;
};

function getLetterSpacing(previewTextHolder){
    let temp = window.getComputedStyle(previewTextHolder, null).getPropertyValue('letter-spacing');
    if(temp=='normal'){
        temp = 0;
    }else{
        temp = makeInt(temp);
    }
    return temp;
}

function truncate(previewRow, previewTextHolder, previewText) {
  var numChars = 0;
  let elFontSize = window
    .getComputedStyle(previewTextHolder, null)
    .getPropertyValue("font-size");
  let temp = getLetterSpacing(previewTextHolder);
  var letterSpace = makeInt(elFontSize) + temp;
  var boxCenter = makeInt(previewRow.scrollWidth) / 2;
  for (var l = letterSpace * 2; l < boxCenter; l += letterSpace) {
    numChars = numChars + 1;
  }

  if (
    letterSpace * previewText.length > previewRow.scrollWidth &&
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

    previewText.innerText = truncate(previewRow,previewText,images[image].title);
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
