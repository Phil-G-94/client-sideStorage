// grab references to DOM element we're looking to manipulate

const htmlElem = document.querySelector('html');
const paraElem = document.querySelector('p');
const imgElem = document.querySelector('img');

// note the original actually uses getElementById() for these...
const bgColorForm = document.querySelector('#bgcolor');
const fontForm = document.querySelector('#font');
const imageForm = document.querySelector('#image');

if (!localStorage.getItem('bgcolor')) {
  populateStorage();
} else {
  setStyles();
};

function populateStorage() {
  // note the original actually uses getElementById() for these...
  localStorage.setItem('bgcolor', document.querySelector('#bgcolor').value);
  localStorage.setItem('font', document.querySelector('#font').value);
  localStorage.setItem('image', document.querySelector('#image').value);

  setStyles();
};

function setStyles() {
  
  const currentColor = localStorage.getItem('bgcolor');
  const currentFont = localStorage.getItem('font');
  const currentImage = localStorage.getItem('image');

  // original uses .getElementById 
  document.querySelector('#bgcolor').value = currentColor;
  document.querySelector('#font').value = currentFont;
  document.querySelector('#image').value = currentImage;

  htmlElem.style.backgroundColor = '#' + currentColor;
  paraElem.style.fontFamily = currentFont;
  imgElem.setAttribute('src', currentImage);

};

bgColorForm.onchange = populateStorage;
fontForm.onchange = populateStorage;
imageForm.onchange = populateStorage;