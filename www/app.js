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
document.addEventListener('prechange', function({ target, tabItem }) {
  if (target.matches('#tabbar')) {
    $('#home-toolbar .center').html(tabItem.getAttribute('label'));
  }
});

//--- called from pokemon.html ---
let savedPokemon = [];

function addPokemonToGrid(pokenumber) {
  // we save a list so we can pass it to the gallery
  savedPokemon.push(pokenumber);

  // now add the new pokemon to the grid in saved.html
  var grid = $('#grid')[0];

  //create a new div element
  var cell = $('<div>').on('click', function() {
    $('#navigator')[0].bringPageTop('gallery.html', {
      data: { pokenumber, savedPokemon }
    });
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
$(document).on('show', function({ target }) {
  if (target.matches('#gallery')) {
    const { pokenumber, savedPokemon } = document.querySelector(
      '#navigator'
    ).topPage.data;

    const carousel = document.querySelector('#carousel');

    // figure out what new pokemon have been saved since we last showed the gallery
    // this way we don't accidentally add the same pokemon twice
    const sliceIndex = carousel.itemCount - savedPokemon.length;

    if (sliceIndex !== 0) {
      // if there are unadded pokemon
      const unaddedPokemon = savedPokemon.slice(sliceIndex);

      unaddedPokemon.map(number => {
        const carouselItem = ons.createElement(`
          <ons-carousel-item>
            <ons-card>
              <img class="gallery-image" src="img/${number}.png" />
            </ons-card>
          </ons-carousel-item>
        `);

        carousel.appendChild(carouselItem);
      });
    }

    // go to the selected pokemon
    carousel.setActiveIndex(savedPokemon.indexOf(pokenumber));
  }
});
