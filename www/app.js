//--- called from login.html ---
// function login() {
//   var username = $('#username').val();
//   var password = $('#password').val();

//   if (username === '' && password === '') {
//     var navigator = $('#navigator')[0];
//     navigator.resetToPage('home.html');
//   } else {
//     ons.notification.toast('Wrong', { timeout: 1000 });
//   }
// }

//--- called from home.html ---
// function openMenu() {
//   $('#menu')[0].open();
// }

//--- called from index.html spliter ---
function loadPage(page) {
  $('#menu')[0].close();
  $('#navigator')[0].bringPageTop(page, { animation: 'fade' });
}

//--- called from home.html to change toolbar title of save.html ---
document.addEventListener('prechange', function(event) {
  if (event.target.matches('#tabbar')) {
    $('#home-toolbar .center').html(event.tabItem.getAttribute('label'));
  }
});

//--- below fails on nox player ---
// document.addEventListener('prechange', function({ target, tabItem }) {
//   if (target.matches('#tabbar')) {
//     $('#home-toolbar .center').html(tabItem.getAttribute('label'));
//   }
// });

//--- called from pokemon.html ---
var savedPokemon = [];

function addPokemonToGrid(pokenumber) {
  // we save a list so we can pass it to the gallery
  savedPokemon.push(pokenumber);

  // now add the new pokemon to the grid in saved.html
  var grid = $('#grid')[0];

  var obj = {
    data: { pokenumber: pokenumber, savedPokemon: savedPokemon }
  };

  //--- jquery fails in nox player ----
  // var cell = $('<div>').on('click', function() {
  //   $('#navigator')[0].bringPageTop('gallery.html', obj);
  // })[0];

  //--------- only non-jquery can work for this part ----------
  var cell = document.createElement('div');

  cell.onclick = function() {
    document.querySelector('#navigator').bringPageTop('gallery.html', obj);
  };

  var image = document.createElement('img');
  var newImage = 'img/' + pokenumber + '.png';
  image.setAttribute('src', newImage);
  //------------- end non-jquery --------------

  //--- works as well but not for nox-player ---
  // var cell = $('<div>').click(function() {
  //   $('#navigator')[0].bringPageTop('gallery.html', obj);
  // })[0];
  // var imgsrc = 'img/' + pokenumber + '.png';
  // var image = $('<img>', { src: imgsrc })[0]; //--create new image

  //--- works as well ---
  //var image = $('<img>').attr('src', `img/${pokenumber}.png`)[0];

  try {
    cell.appendChild(image); // throws undefined error why?
  } catch (error) {
    ons.notification.alert(error);
  }

  grid.appendChild(cell);
}

//--- called from pokemon.html ---
function savePokemon(pokenumber, button) {
  addPokemonToGrid(pokenumber);
  //looks for its parent ons-list-item
  button.closest('ons-list-item').hideExpansion();
}

//--- to catch the show event from gallery.html ---
$(document).on('show', function(event) {
  if (event.target.matches('#gallery')) {
    var pokenumber = $('#navigator')[0].topPage.data.pokenumber;
    var savedPokemon = $('#navigator')[0].topPage.data.savedPokemon;

    //var carousel = document.querySelector('#carousel');
    var carousel = $('#carousel');

    // figure out what new pokemon have been saved since we last showed the gallery
    // this way we don't accidentally add the same pokemon twice
    // -ve sliceIndex means extract from the end of the array
    var sliceIndex = carousel.itemCount - savedPokemon.length;

    if (sliceIndex !== 0) {
      // if there are unadded pokemon, -ve sliceIndex means extract last element of savedPokemon.
      var unaddedPokemon = savedPokemon.slice(sliceIndex);

      unaddedPokemon.map(function(number) {
        var newItem = '<ons-carousel-item>';
        newItem += '<ons-card>';
        newItem += '<img class="gallery-image" src="img/';
        newItem += number;
        newItem += '.png" />';
        newItem += '</ons-card>';
        newItem += ' </ons-carousel-item>';
        var carouselItem = ons.createElement(newItem);

        carousel.append(carouselItem);
      });
    }

    // go to the selected pokemon
    carousel[0].setActiveIndex(savedPokemon.indexOf(pokenumber));
    //--- also works ---
    //$('#carousel')[0].setActiveIndex(savedPokemon.indexOf(pokenumber));
  }
});

//--- Pokemon API ---
function appendPokemon(pokenumber, name) {
  //var list = document.querySelector('#pokemon-list');
  var list = $('#pokemon-list')[0];
  var newElement = '<ons-list-item expandable>';
  newElement += pokenumber + ' ' + name;
  newElement += ' <div class="expandable-content">';
  newElement += '<ons-button onclick="savePokemon(';
  newElement += pokenumber;
  newElement += ', this)">Save</ons-button>';
  newElement += ' </div>';
  newElement += '</ons-list-item>';

  list.append(ons.createElement(newElement));
}

//--- when pokemon.html loads ---
$(document).on('init', function(event) {
  if (event.target.matches('#pokemon')) {
    var url = 'https://pokeapi.co/api/v2/pokemon';
    var nextPokenumber = 1; // use to keep track of the Pokémon numbers

    function get() {
      var json;

      // do the API call and get JSON response
      $.ajax(url)
        .done(function(response) {
          json = response;
          const newPokemon = json.results.map(function(e) {
            return e.name;
          });

          const list = document.querySelector('#pokemon-list');
          newPokemon.forEach(function(name) {
            var newElement = ' <ons-list-item expandable>';
            newElement += nextPokenumber + ' ' + name;
            newElement += ' <div class="expandable-content">';
            newElement += '<ons-button onclick="savePokemon(';
            newElement += nextPokenumber;
            newElement += ', this)">Save</ons-button>';
            newElement += '</div>';
            newElement += '</ons-list-item>';

            list.appendChild(ons.createElement(newElement));
            nextPokenumber++;
          });

          url = json.next;

          // hide the spinner when all the pages have been loaded
          if (!url) {
            document.querySelector('#after-list').style.display = 'none';
          }
        })
        .fail(function() {
          ons.notification.alert('ajax get fail..');
          console.log('ajax get fail...');
        });
    }

    // get the first set of results as soon as the page is initialised
    get();

    // at the bottom of the list get the next set of results and append them
    event.target.onInfiniteScroll = function(done) {
      if (url) {
        setTimeout(function() {
          get();
          done();
        }, 200);
      }
    };
  }
});

// $(document).on('init', function(event) {
//   if (event.target.matches('#pokemon')) {
//     // local storage keys
//     var URL = 'pokemon__url';
//     var PREFIX = 'pokemon__';

//     var nextPokenumber = 1;
//     var storedPokemon;

//     while (
//       (storedPokemon = localStorage.getItem(PREFIX + nextPokenumber)) !== null
//     ) {
//       var msg =
//         'got ' +
//         storedPokemon +
//         'from local with key' +
//         PREFIX +
//         nextPokenumber;
//       console.log(msg);
//       appendPokemon(nextPokenumber, storedPokemon);
//       nextPokenumber++;
//     }

//     if (!localStorage.getItem(URL)) {
//       localStorage.setItem(URL, 'https://pokeapi.co/api/v2/pokemon');
//     }

//     function get() {
//       // do the API call and get JSON response
//       // var response = await fetch(localStorage.getItem(URL));
//       // var json = await response.json();
//       var json;

//       $.ajax(localStorage.getItem(URL))
//         .done(function(response) {
//           // json = response.json();
//           //console.log('... ' + response);
//           json = response;
//           var newPokemon = json.results.map(function(e) {
//             return e.name;
//           });
//           var list = $('#pokemon-list')[0];
//           newPokemon.forEach(function(name, i) {
//             appendPokemon(nextPokenumber, name);

//             var key = PREFIX + nextPokenumber;
//             console.log('Storing ' + name + 'as' + key);
//             localStorage.setItem(key, name);
//             nextPokenumber++;
//           });

//           localStorage.setItem(URL, json.next);

//           // hide the spinner when all the pages have been loaded
//           if (!localStorage.getItem(URL)) {
//             $('#after-list').css('display', 'none');
//           }
//         })
//         .fail(function() {
//           ons.notification.alert('ajax localstorage fail..');
//           console.log('ajax localStorage fail...');
//         });
//     }

//     // get the first set of results as soon as the page is initialised
//     get();

//     // at the bottom of the list get the next set of results and append them
//     event.target.onInfiniteScroll = function(done) {
//       if (localStorage.getItem(URL)) {
//         setTimeout(function() {
//           get();
//           done();
//         }, 200);
//       }
//     };
//   }
// });

//--- called from index.html splitter side menu ---
function clearLocalStorage() {
  localStorage.clear();
  ons.notification.alert('Cleared local storage');
}
