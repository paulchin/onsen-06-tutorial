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
