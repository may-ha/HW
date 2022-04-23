// modify the previous program to create a simple login system utilizing an array of user objects

var userlogin = {
  username: "mai",
  password: "12345",
};
function getInfo() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  for (let i = 0; i < userlogin.length; i++) {
    if (
      username == userlogin[i].username &&
      password == userlogin[i].password
    ) {
    } else {
    }
  }
}
