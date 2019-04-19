//--- called from login.html ---
function login() {
  var username = $('#username').val();
  var password = $('#password').val();

  if (username === '' && password === '') {
    var navigator = $('#navigator')[0];
    navigator.resetToPage('home.html');
  } else {
    ons.notification.toast('Wrong', { timeout: 1000 });
  }
}

//--- called from home.html ---
function openMenu() {
  $('#menu')[0].open();
}

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

  //create a new div element
  // var obj = {
  //   data: { pokenumber, savedPokemon }
  // };
  var obj = {
    data: { pokenumber: pokenumber, savedPokemon: savedPokemon }
  };
  var cell = $('<div>').on('click', function() {
    $('#navigator')[0].bringPageTop('gallery.html', obj);
  })[0];

  //--- works as well ---
  // var cell = $('<div>').click(function() {
  //   $('#navigator')[0].bringPageTop('gallery.html', {
  //     data: { pokenumber, savedPokemon }
  //   });
  // })[0];

  var imgsrc = 'img/' + pokenumber + '.png';
  var image = $('<img>', { src: imgsrc })[0]; //--create new image

  //--- works as well ---
  //var image = $('<img>').attr('src', `img/${pokenumber}.png`)[0];

  cell.append(image);

  grid.append(cell);
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

      unaddedPokemon.map(number => {
        var carouselItem = ons.createElement(`
          <ons-carousel-item>
            <ons-card>
              <img class="gallery-image" src="img/${number}.png" />
            </ons-card>
          </ons-carousel-item>
        `);

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

$(document).on('init', function({ target }) {
  if (target.matches('#pokemon')) {
    // local storage keys
    var URL = 'pokemon__url';
    var PREFIX = 'pokemon__';

    var nextPokenumber = 1;
    var storedPokemon;

    while (
      (storedPokemon = localStorage.getItem(PREFIX + nextPokenumber)) !== null
    ) {
      var msg =
        'got ' +
        storedPokemon +
        'from local with key' +
        PREFIX +
        nextPokenumber;
      console.log(msg);
      appendPokemon(nextPokenumber, storedPokemon);
      nextPokenumber++;
    }

    if (!localStorage.getItem(URL)) {
      localStorage.setItem(URL, 'https://pokeapi.co/api/v2/pokemon');
    }

    async function get() {
      // do the API call and get JSON response
      var response = await fetch(localStorage.getItem(URL));
      var json = await response.json();

      var newPokemon = json.results.map(e => e.name);

      //var list = document.querySelector('#pokemon-list');
      var list = $('#pokemon-list')[0];
      newPokemon.forEach((name, i) => {
        appendPokemon(nextPokenumber, name);

        var key = PREFIX + nextPokenumber;
        console.log('Storing ' + name + 'as' + key);
        localStorage.setItem(key, name);
        nextPokenumber++;
      });

      localStorage.setItem(URL, json.next);

      // hide the spinner when all the pages have been loaded
      if (!localStorage.getItem(URL)) {
        //document.querySelector('#after-list').style.display = 'none';
        $('#after-list').css('display', 'none');
      }
    }

    // get the first set of results as soon as the page is initialised
    get();

    // at the bottom of the list get the next set of results and append them
    target.onInfiniteScroll = done => {
      if (localStorage.getItem(URL)) {
        setTimeout(() => {
          get();
          done();
        }, 200);
      }
    };
  }
});

//--- called from index.html splitter side menu ---
function clearLocalStorage() {
  localStorage.clear();
  ons.notification.alert('Cleared local storage');
}
