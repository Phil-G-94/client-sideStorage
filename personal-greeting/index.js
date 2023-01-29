// create references to all the DOM elements we are looking to manipulate

const rememberDiv = document.querySelector('.remember');
const forgetDiv = document.querySelector('.forget');

const form = document.querySelector('form');

const nameInput = document.querySelector('#entername');
const submitBtn = document.querySelector('#submitname');
const forgetBtn = document.querySelector('#forgetname');

const h1 = document.querySelector('h1');
const personalGreeting = document.querySelector('.personal-greeting');


// handler function to run when submit button is clicked

submitBtn.addEventListener('click', () => {
  // commits the user-input name to local storage as a key('name') / value pair (nameInput.value) 
  localStorage.setItem('name', nameInput.value);
  
  // hoisted function call. invoke nameDisplayCheck() to sort out displaying the personalised greetings and updating the form display
  nameDisplayCheck();

});


// handler function to run when the 'Forget' button is clicked

forgetBtn.addEventListener('click', () => {
  // remove the previously set key/value pair from localStorage object
  localStorage.removeItem('name');

  // hoisted function call. invoke nameDisplayCheck() to sort out displaying the generic greeting again and updating the form display
  nameDisplayCheck();

});


function nameDisplayCheck() {
  // checks whether the 'name' datum is stored in localStorage;
  if (localStorage.getItem('name')) {

    // if conditional returns true, display personalised greeting
    const name = localStorage.getItem('name');
    h1.textContent = `Welcome, ${name}`;
    personalGreeting.textContent = `Welcome to this website, ${name}! We hope you enjoy the generic text displayed alongside the personalised greeting.`;
    
    // show the 'forget' button option
    forgetDiv.style.display = 'block';

    // hide the 'remember' button option
    rememberDiv.style.display = 'none';

  } else {

    // if conditional returns false, show generic greeting
    h1.textContent = "Welcome to this website";
    personalGreeting.textContent = `Welcome to this website. We hope you enjoy the generic text while you're here.`;
    
    // hide the 'forget' form option
    forgetDiv.style.display = 'none';
    // show the 'remember' form option
    rememberDiv.style.display = 'block';

  };
}; 

// execute function call - works as expected

nameDisplayCheck();