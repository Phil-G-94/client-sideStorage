// grab references to DOM element we're looking to manipulate

const htmlElem = document.querySelector('html');
const paraElem = document.querySelector('p');
const imgElem = document.querySelector('img');

// note the original actually uses getElementById() for these...
const bgColorForm = document.querySelector('#bgcolor');
const fontForm = document.querySelector('#font');
const imageForm = document.querySelector('#image');

// testing whether storage has been populated (i.e. - the page has been previously accessed);

if (!localStorage.getItem('bgcolor')) {
  // if not, we run populateStorage() to add the existing customisation values to the storage
  populateStorage();
} else {
  // if there are already values there, we run setStyles() to update the page styling with the stored values
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
  
  // first three lines grab the values from local storage, set above. 
  const currentColor = localStorage.getItem('bgcolor');
  const currentFont = localStorage.getItem('font');
  const currentImage = localStorage.getItem('image');

  // original uses .getElementById 
  // set values displayed in the form elements to those values, so that they keep in sync when you reload the page. 
  document.querySelector('#bgcolor').value = currentColor;
  document.querySelector('#font').value = currentFont;
  document.querySelector('#image').value = currentImage;

  // update html.backgroundColor, p.fontFamily and imgElem src to the options stored in local storage  
  htmlElem.style.backgroundColor = '#' + currentColor;
  paraElem.style.fontFamily = currentFont;
  imgElem.setAttribute('src', currentImage);

};

// onchange handler on each form element so that the data and styling are updated whenever a form value is changed. 
bgColorForm.onchange = populateStorage;
fontForm.onchange = populateStorage;
imageForm.onchange = populateStorage;