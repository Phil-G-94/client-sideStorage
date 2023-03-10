// Constants and DOM references
const section = document.querySelector('section');

const videos = [
  { 'name' : 'crystal' },
  { 'name' : 'elf' },
  { 'name' : 'frog' },
  { 'name' : 'monster' },
  { 'name' : 'pig' },
  { 'name' : 'rabbit' }
];

// create an instance of a db object for us to store our database in
let db;

// initialisation function
function init() {

  // for loop to iterate through array of video objects provided above
  for (const video of videos) {

    // open transaction, grabbing a reference to the object store
    const objectStore = db.transaction('videos_os').objectStore('videos_os');

    // retrieve each video by name using .get() method on objectStore
    const request = objectStore.get(video.name);

    request.addEventListener('success', () => {

      // if the .result property of request object returns true (database exists and is not undefined)
      if (request.result) {
        console.log('taking videos from indexedDB');
        // Grab the videos from IDB and display them using displayVideo()
        displayVideo(request.result.mp4, request.result.webm, request.result.name);
      } else {
        // fetch the videos from the network
        fetchVideoFromNetwork(video);
      }
    });
  }
}

// define the fetchVideoFromNetwork() function

function fetchVideoFromNetwork(video) {
  // state that fetching operation has began
  console.log('fetching videos from network');


  // fetch the MP4 and WebM versions of the video using the fetch() function,
  // then expose their response bodies as blobs, giving us an object representation of the videos that can be
  // stored and used later on in the code
  
  const mp4Blob = fetch(`videos/${video.name}.mp4`).then(response => response.blob());
  const webmBlob = fetch(`videos/${video.name}.webm`).then(response => response.blob());

  // since the above requests are both asynchronous and we only want to store or display the videos once the promises are fullfilled, we
  // use the Promise.all() built in method. Returns a promise that is fulfilled once all the individual promises are fulfilled. 
  
  Promise.all([mp4Blob, webmBlob]).then(values => {
    // inside the .then() handler of, we call
    // displayVideo() to display video fetched from the network and, 
    displayVideo(values[0], values[1], video.name);

    // call storeVideo() to store it to IDB
    storeVideo(values[0], values[1], video.name); 
  });
}

// define the storeVideo() function
function storeVideo(mp4Blob, webmBlob, name) {
  
  // we open a 'readwrite' transaction and get a reference to our videos_os object store
  const objectStore = db
    .transaction(['videos_os'], 'readwrite')
    .objectStore('videos_os');

  // create an object representing the record to add it to the IDB
  const record = {
    mp4 : mp4Blob,
    webm : webmBlob, 
    name : name
  };

  // add record to the IDB using .add() 
  const request = objectStore.add(record);

  // success msg statement if record added successfully
  request.addEventListener('success', () => console.log('Record addition attempt finished'));
  // error msg statement if record wasn't added successfully
  request.addEventListener('error', () => console.error(request.error));
}

// Define the displayVideo() function

function displayVideo(mp4Blob, webmBlob, title) {

  // create object URLs out of the blobs
  const mp4URL = URL.createObjectURL(mp4Blob);
  const webmURL = URL.createObjectURL(webmBlob);

  // create DOM elements to embed video in this page
  const article = document.createElement('article');
  const h2 = document.createElement('h2');
  h2.textContent = title;
  const video = document.createElement('video');
  video.controls = true;
  const source1 = document.createElement('source');
  source1.src = mp4URL;
  source1.type = 'video/mp4';
  const source2 = document.createElement('source');
  source2.src = webmURL;
  source2.type = 'video/webm';

  // Embed DOM elements into page
  section.appendChild(article);
  article.appendChild(h2);
  article.appendChild(video);
  video.appendChild(source1);
  video.appendChild(source2);
}

// Open database; it is created if it doesn't already exist

const request = window.indexedDB.open('videos_db', 1);

// error handler signifies that the db didn't open succesfully
request.addEventListener('error', () => console.error('Database failed to open'));

// success handler signifies that the db opened succesfully
request.addEventListener('success', () => {
  
  console.log('Database successfully opened');

  // stored the opened databse object in the db variable. this is used in the db tables setup event handler below
  db = request.result;

  // call the init() function to fetch the videos from IDB 
  init();
});

// setup the database tables if this has not already been done

request.addEventListener('upgradeneeded', e => {
  
  // grab a reference to the opened database
  const db = e.target.result;

  // create an objectStore to store our videos in 
  // including a auto-incrementing key
  const objectStore = db.createObjectStore('videos_os', { keyPath: 'name' });

  // define what data items the objectStore will contain
  objectStore.createIndex('mp4', 'mp4', { unique: false });
  objectStore.createIndex('webm', 'webm', { unique: false });

  console.log('Database setup complete');
});

// registering service worker so the website works offline
// first we check if the 'serviceWorker' method is available on the window.navigator interface
if ('serviceWorker' in navigator) {

  // if it is, we run .register().then() to register the service worker and log to console that it has been registered
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.log('Service Worker Registered'))
};