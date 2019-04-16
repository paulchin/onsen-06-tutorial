function login() {
  var username = $('#username').val();
  var password = $('#password').val();

  if (username === 'user' && password === 'pass') {
    ons.notification.alert('Correct!');
  } else {
    ons.notification.alert('Wrong');
  }
}
