const popUps = document.querySelectorAll(".popup");
const popUpInner = document.querySelectorAll(".popup .inner");
var users = [];
$(document).ready(function () {
  getUser();
});

function getUser() {
  fetch("https://localhost:7039/api/Mission/Getusers")
    .then((response) => response.json())
    .then((data) => fillData(data))
    .catch((error) => console.error("Unable to get items.", error));
}

popUps.forEach(function (popUp) {
  popUp.addEventListener("click", function (e) {
    popUp.style.display = "none";
  });
});

popUpInner.forEach(function (inner) {
  inner.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});
const arr = JSON.parse(localStorage.getItem("ListUsers")) || [];

if (localStorage.getItem("ListUsers")) {
  let arr = JSON.parse(localStorage.getItem("ListUsers"));
  fillData(arr);
}

let idU = 1;
function addUser(btn) {
  const formElem = btn.closest(".add-user");

  const n = formElem.querySelector('input[name="username"]').value;
  const f = formElem.querySelector('input[name="fullname"]').value;
  const pass = formElem.querySelector('input[name="password"]').value;

  let isFound = false;

  if (localStorage.getItem("ListUsers")) {
    let arr = JSON.parse(localStorage.getItem("ListUsers"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].username) === Number(n)) {
        isFound = true;
        break;
      }
    }
  }

  if (isFound) {
    alert("User Can not be With the same username");
  } else {
    const UsersObject = {
      Id: idU++,
      Name: f,
      Username: n,
      Password: pass,
    };

    arr.push(UsersObject);
    fetch("https://localhost:7039/api/Mission/AddUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(UsersObject),
    })
      .then((response) => response.json())
      .then(() => {
        getUser();
        (Name.value = ""), (Username.value = ""), (Password.value = "");
      })
      .catch((error) => console.error("Unable to add item.", error));
  }
  fillData(arr);

  formElem.querySelectorAll("input").forEach(function (input) {
    input.value = "";
  });

  popUps.forEach(function (popUp) {
    popUp.style.display = "none";
  });
}

function fillData(arr) {
  const dataTable = document.getElementById("dataTable").querySelector("tbody");
  dataTable.innerHTML = "";
  users = arr;
  for (let i = 0; i < arr.length; i++) {
    const tr = document.createElement("tr");
    let entries = Object.entries(arr[i]);
    for (let j = entries.length - 2; j >= 1; j--) {
      const td = document.createElement("td");
      td.id = entries[j][0];
      td.innerHTML = entries[j][1];
      tr.appendChild(td);
      tr.id = arr[i].id;
    }
    // tr.id = entries[i][1];
    const lastTd = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-data-btn");
    deleteBtn.innerHTML = "x";
    deleteBtn.addEventListener("click", deleteUser);

    const editBtn = document.createElement("i");
    editBtn.classList.add("fa-solid", "fa-pen-to-square");
    editBtn.addEventListener("click", showUpUser);

    lastTd.appendChild(editBtn);
    lastTd.appendChild(deleteBtn);

    tr.appendChild(lastTd);

    dataTable.appendChild(tr);
  }
}

let userID_outside;

function deleteUser(e) {
  const thisID = Number(e.target.closest("tr").id);

  fetch(`https://localhost:7039/api/Mission/DeleteUser?id=${thisID}`, {
    method: "DELETE",
  })
    .then(() => getUser())
    .catch((error) => console.error("Unable to delete item.", error));
  //const tr = id.target.closest("tr");
  const userTd = Number(tr.querySelector("#username").innerHTML);
  if (localStorage.getItem("ListUsers")) {
    let arr = JSON.parse(localStorage.getItem("ListUsers"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].username) === userTd) {
        arr.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("List", JSON.stringify(arr));
    fillData(arr);
  }
}

let orginalCodeVal;

function showUpUser(e) {
  const updatePopup = document.querySelector(".update-pop");
  updatePopup.style.display = "block";

  const tr = e.target.closest("tr");
  userID_outside = Number(tr.id);
  const userTdVal = tr.querySelector("#username").innerHTML;
  const nameTdVal = tr.querySelector("#name").innerHTML;

  orginalCodeVal = userTdVal;

  const inputUserName = updatePopup.querySelector('input[name="username"]');
  const inputName = updatePopup.querySelector('input[name="name"]');

  inputUserName.value = userTdVal;
  inputName.value = nameTdVal;
}

function updateUsers() {
  const updatePopup = document.querySelector(".update-pop");
  const inputUserName = updatePopup.querySelector('input[name="username"]');
  const inputName = updatePopup.querySelector('input[name="name"]');
  var user = {
    id: userID_outside,
  };
  var user = users.find((x) => x.id == userID_outside);
  if (!user) {
    alert("user not founded");
    return;
  }
  user.username = inputUserName.value;
  user.name = inputName.value;

  fetch(`https://localhost:7039/api/Mission/updateUser`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(() => getUser())
    .catch((error) => console.error("Unable to update item.", error));

  if (localStorage.getItem("ListUsers")) {
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].username) === orginalCodeVal) {
        arr[i].username = inputUserName.value;
        arr[i].name = inputName.value;
        break;
      }
    }
    localStorage.setItem("ListUsers", JSON.stringify(arr));
    fillData(arr);
  }
  updatePopup.style.display = "none";
}
