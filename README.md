# Client-side storage

- Modern web browsers support a number of ways for website to store data on user's computer/with user's permission/retrieve it when necessary. 
- Allows us to: 
  - persist data for long-term storage, 
  - save sites or documents for offline use,
  - retain user-specific settings for your site

## Background
- Most major websites are dynamic - they store data on the server using some kind of DB, then run server-side code to retrieve data, insert into static template, and serve the resulting HTML to client to be displayed in browser. 

- Client-side storage works on similar principles but has different uses. It consists of JS APIs that allow you to store data on client
and then retrieve it when needed. Allows us to:
  - Personalise site preferences
  - Persist previous activity 
  - Save data and assets locally so a site will be quicker / cost less bandwidth to load / be usable offline 
  - Save web application generated documents locally for use offline

- Client-side and server-side storage are used together. 

- There are limits to the amount of data you can store using client-side storage APIs. See [Browser storage limits and eviction criteria](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#client-side_storage)

## Web Storage and IndexedDB APIs

- Web Storage API provides a mechanism for storing/retrieving small data items consisting of a name and a corresponding value. Best for simple data. 

- IndexedDB API provides browser with a complete database system for storing complex data, i.e. complete customer information record sets or complex data types like audio/video files. 

- The Cache API; designed for storing HTTP responses to specific requests. Very useful for storing website assets offline so site can subsequently be used without network connection. 
  - Usually used in combination with Service Worker API...advanced topic, further info elsewhere. 

## Storing simple data - web storage 

- All web storage is contained within two object-like structures inside the browser: sessionStorage and localStorage. 
- sessionStorage object persists data for as long as the browser is open...data lost when browser is closed. 
- localStorage object persists data even after the browser is closed/opened again. 

- use .setItem() method to persist simplistic data in localStorage - takes two params (name, value). 
- use .getItem() to retrieve - takes one param (name).
- use .removeItem() to remove - takes one param (name). 

- Separate storage / data store for each domain loaded in the browser. 

### Active Learning: Web Storage API 

- personal-greeting directory contains a simplistic use of .setItem() || .getItem() || .removeItem() methods of the Web Storage API. More information, and a more detailed guide available via [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#basic_concepts) reference page.

  - Storage objects are simple key-value stores; similar to objects. can be accessed used dot/bracket notation, or using .setItem() || .getItem() || .removeItem() methods. 
  
  - It is recommended to use the Web Storage API methods (setItem, get Item, removeItem, key, length). There are known pitfalls in doing otherwise, documented [here](https://2ality.com/2012/01/objects-as-maps.html). 

  - Two mechanisms in Web Storage; sessionStorage and localStorage (persists even when browser is closed). 

  - Both are made available via Window.sessionStorage / Window.localStorage. invoking one of these creates its own instance of the Storage object. A different storage object is used for the sessionStorage and localStorage for each origin - they function and are controlled separately.

  - Web Storage API is available in current versions of all major browsers. There are exceptions: 
    - (older browsers) 
    - (browser doesn't make the API available to scripts on the page) >> happens in private browsing mode?
    - [how to feature-detect localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage).

#### Web Storage Demo

