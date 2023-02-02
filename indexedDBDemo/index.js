// grab DOM element references and store in variables, global scope

const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// Create an instance of the db object for us to store the open database in
// declared globally as it will be relied on frequently throughout the code 

let db;

// Open database; created if not already existing. 
// creates a request to open version 1 of a database called notes_db. Asynchronous operation; creates a request object
// will use event handlers to run code the when request completes || fails || etc.
const openRequest = window.indexedDB.open('notes_db', 1);

// Error handler
openRequest.addEventListener('error', () => {
  console.error('Database failed to open');
});

// Success handler 
openRequest.addEventListener('success', () => {

  console.log('Database opened successfully');
  // if database successfully opened, an object representing the database becomes available in the openRequest.result prop
  // allows manipulation of db. we assign the global db var the value of this request object
  db = openRequest.result;

  // hoisted function call. Will display the db data inside the <ul> element
  // we call the function here so that notes already in the db are displayed as soon as the page loads 
  displayData();

});


// Defines the database schema || [structure]
openRequest.addEventListener('upgradeneeded', (e) => {

  // grab a reference to the existing db from result property of event target. equivalent to db = openRequest.result; 
  db = e.target.result;

  // create a new object store called notes_os using .cOS method. Equivalent to a single table in a conventional database system. 
  // we specify an autoIncrement key field called 'id'. 'id' will be used to uniquely identify records, such as when deleting or displaying a record. 
  const objectStore = db.createObjectStore('notes_os', {
    keypath: 'id',
    autoIncrement: true,
  });


  // we also create two other indexes (fields) using .createIndex(). creates a title and body for each note. 
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });

  console.log('Database setup complete');
});

// Adding data to the database; 

// submit event handler calls addData() when form has been submitted 
form.addEventListener('submit', addData);

// addData() function definition

function addData(e) {

  // prevents form submitting by default 
  e.preventDefault();

  // grab values entered into form fields and store them in an object ready to be inserted into the DB
  // * we don't explicitly include the id value as this is auto-populated (inherited?) from the objectStore object.
  const newItem = { title: titleInput.value, body: bodyInput.value };

  // open a read/write db transaction, ready for adding the data. this transaction object allows us to access the object store so 
  // we can manipulate/add to data 
  const transaction = db.transaction(['notes_os'], 'readwrite');

  // access object store that's already been added to the DB, saving the result in the objectStore variable
  const objectStore = transaction.objectStore('notes_os');

  //  make a request to add our newItem object to the object store. .add() creates a request object..
  const addRequest = objectStore.add(newItem);

  // if added successfully, clear the form fields for next entry
  addRequest.addEventListener('success', () => {
    titleInput.value = '';
    bodyInput.value = '';
  });

  // report on transaction succesfully completing, when everything is done
  transaction.addEventListener('complete', () => {

    console.log('Transaction completed: database modification finished.');

    // call displayData() again to update the data display and show the newly added item
    displayData();
  });

  // transaction error message 
  transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));

};

// Data display function
function displayData() {

  // we empty the contents of the list element each time the display is updated
  // if we didn't do this we'd get duplicates listed each time a new note is added 
  while (list.firstChild) {

    list.removeChild(list.firstChild);
  };

  // Open our object store and then get a cursor using .openCursor() - which iterates through all the 
  // different data items in the store
  const objectStore = db.transaction('notes_os').objectStore('notes_os');
  objectStore.openCursor().addEventListener('success', (e) => {

    // get a reference to cursor object
    const cursor = e.target.result;

    // if there is still another datum to iterate through keep running this code
    if (cursor) {

      const listItem = document.createElement('li');
      const h3 = document.createElement('h3');
      const para = document.createElement('p');

      listItem.appendChild(h3);
      listItem.appendChild(para);
      list.appendChild(listItem);

      // put the data from the cursor inside the h3 and para
      h3.textContent = cursor.value.title;
      para.textContent = cursor.value.body;

      // store the ID of the datum inside an attribute on the listItem, so we know
      // which item it corresponds to. This will be useful when deleting items
      listItem.setAttribute('data-node-id', cursor.value.id);

      // Delete button
      const deleteBtn = document.createElement('button');
      listItem.appendChild(deleteBtn);
      deleteBtn.textContent = 'Delete';

      // Delete button event handler. Calls deleteItem() when the delete button is clicked. 
      deleteBtn.addEventListener('click', deleteItem);

      // iterate to the next item in the cursor
      cursor.continue();
    } else {
      // If list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored.';
        list.appendChild(listItem);
      }

      // if no more data to iterate through, log 'Notes all displayed' to console. when no more to iterate through cursor will return *undefined*
      console.log('Notes all displayed');
    }
  });
};

// Deleting items || defining deleteItem()

function deleteItem(e) {

  // retrieves the name of the task we want deleted (see line 141)
  // we need to convert this name to a number before trying to use it with indexedDB
  // iDB values are case-sensitive
  const noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

  // open a database transaction and delete the task, finding it using the id we retrieved above
  const transaction = db.transaction(['notes_os'], 'readwrite');
  const objectStore = transaction.objectStore('notes_os');
  const deleteRequest = objectStore.delete(noteId);

  // report that the data item has been deleted
  transaction.addEventListener('complete', () => {

    // delete the parent of the button, the list item, so it's not displayed
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);

    // log succesful completion to the console
    console.log(`Note ${noteId} succesfully deleted`);

    // again, if list empty display a messaging saying so
    if (!list.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No notes stored';
      list.appendChild(listItem);
    }

  });

}
