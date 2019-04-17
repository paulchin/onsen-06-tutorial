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

const addPokemonToGrid = pokenumber => {
  // we save a list so we can pass it to the gallery
  savedPokemon.push(pokenumber);

  // now add the new pokemon to the grid
  var grid = $('#grid')[0];
  //create a new div element
  var cell = $('<div>')[0];

  cell.onclick = function() {
    $('#navigator')[0].bringPageTop('gallery.html', {
      data: { pokenumber, savedPokemon }
    });
  };

  var imgsrc = 'img/' + pokenumber + '.png';
  var image = $('<img>', { src: imgsrc })[0]; //--create new image

  //var image = $('<img>').attr('src', `img/${pokenumber}.png`)[0];

  cell.append(image);

  grid.append(cell);
};

function savePokemon(pokenumber, button) {
  addPokemonToGrid(pokenumber);
  //looks for its parent ons-list-item
  button.closest('ons-list-item').hideExpansion();
}
