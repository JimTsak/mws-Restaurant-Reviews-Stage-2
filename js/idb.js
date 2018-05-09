import idb from 'idb';
//importScripts('node_modules/idb/lib/idb.js');

console.log("inside my idb.js");

// If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

var dbPromise = idb.open('restaurant', 1, upgradeDb => {
  switch(upgradeDb.oldVersion) {
    case 0:
      var restaurantsStore =  upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
      console.log("db restaurant created!");
  }
});





// read "hello" in "keyval"
// dbPromise.then(function(db) {
//   var tx = db.transaction('keyval');
//   var keyValStore = tx.objectStore('keyval');
//   return keyValStore.get('hello');
// }).then(function(val) {
//   console.log('The value of "hello" is:', val);
// });

// set "foo" to be "bar" in "keyval"
dbPromise.then(db => {
  const tx = db.transaction('restaurants', 'readwrite');
  const restaurantsStore = tx.objectStore('restaurants');
  restaurantsStore.put({
    id: 123456,
    data: {foo: "bar"}
  });
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:cat to keyval');
});

// add people to "people"
dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    favoriteAnimal: 'cat'
  });

  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    favoriteAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

// list all cat people
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('Cat people:', people);
});

// people by age
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var ageIndex = peopleStore.index('age');

  return ageIndex.getAll();
}).then(function(people) {
  console.log('People by age:', people);
});

// Using cursors
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var ageIndex = peopleStore.index('age');

  return ageIndex.openCursor();
}).then(function(cursor) {
  if (!cursor) return;
  return cursor.advance(2);
}).then(function logPerson(cursor) {
  if (!cursor) return;
  console.log("Cursored at:", cursor.value.name);
  // I could also do things like:
  // cursor.update(newValue) to change the value, or
  // cursor.delete() to delete this entry
  return cursor.continue().then(logPerson);
}).then(function() {
  console.log('Done cursoring');
});