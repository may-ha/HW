const popUps = document.querySelectorAll(".popup");
const popUpInner = document.querySelectorAll(".popup .inner");
var products = [];
$(document).ready(function () {
  getProduct();
});

function getProduct() {
  fetch("https://localhost:7039/api/Mission/Getproduct")
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
const arr = JSON.parse(localStorage.getItem("ListProducts")) || [];

if (localStorage.getItem("ListProducts")) {
  let arr = JSON.parse(localStorage.getItem("ListProducts"));
  fillData(arr);
}

let idU = 1;
function addProduct(btn) {
  const formElem = btn.closest(".add-user");

  const c = formElem.querySelector('input[name="code"]').value;
  const n = formElem.querySelector('input[name="name"]').value;
  const cat = formElem.querySelector('input[name="catagory"]').value;

  let isFound = false;

  if (localStorage.getItem("ListProducts")) {
    let arr = JSON.parse(localStorage.getItem("ListProducts"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].code) === Number(c)) {
        isFound = true;
        break;
      }
    }
  }

  if (isFound) {
    alert("User Can not be With the same username");
  } else {
    const ProductObject = {
      Id: idU++,
      Code: c,
      Name: n,
      CategoryType: cat,
      Date: new Date(),
    };

    arr.push(ProductObject);
    fetch("https://localhost:7039/api/Mission/Addproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ProductObject),
    })
      .then((response) => response.json())
      .then(() => {
        getProduct();
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
  products = arr;
  for (let i = 0; i < arr.length; i++) {
    const tr = document.createElement("tr");
    let entries = Object.entries(arr[i]);
    for (let j = 0; j < entries.length; j++) {
      const td = document.createElement("td");
      td.id = entries[j][0];
      td.innerHTML = entries[j][1];
      tr.appendChild(td);
      tr.id = arr[i].id;
    }

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

let product_outside;

function deleteUser(e) {
  const thisID = Number(e.target.closest("tr").id);

  fetch(`https://localhost:7039/api/Mission/DeleteProduct?id=${thisID}`, {
    method: "DELETE",
  })
    .then(() => getProduct())
    .catch((error) => console.error("Unable to delete item.", error));
  const productTd = Number(tr.querySelector("#name").innerHTML);
  if (localStorage.getItem("ListProducts")) {
    let arr = JSON.parse(localStorage.getItem("ListProducts"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].name) === productTd) {
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
  const codeTdVal = tr.querySelector("#code").innerHTML;
  const nameTdVal = tr.querySelector("#name").innerHTML;
  const catTdVal = tr.querySelector("#category");

  orginalCodeVal = codeTdVal;

  const inputProductCode = updatePopup.querySelector('input[name="code"]');
  const inputName = updatePopup.querySelector('input[name="name"]');
  const inputcatagory = updatePopup.querySelector('input[name="category"]');

  inputProductCode.value = codeTdVal;
  inputName.value = nameTdVal;
  inputcatagory.value = catTdVal;
}

function updateProdouct() {
  const updatePopup = document.querySelector(".update-pop");
  const inputProductCode = updatePopup.querySelector('input[name="code"]');
  const inputName = updatePopup.querySelector('input[name="name"]');
  const inputcatagory = updatePopup.querySelector('input[name="category"]');
  var products = {
    id: product_outside,
  };

  products.name = inputName.value;
  products.code = inputProductCode.value;
  products.CategoryType = inputcatagory.value;

  fetch(`https://localhost:7039/api/Mission/updateProduct`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(products),
  })
    .then(() => getProduct())
    .catch((error) => console.error("Unable to update item.", error));

  if (localStorage.getItem("ListProducts")) {
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].code) === orginalCodeVal) {
        arr[i].name = inputName.value;
        arr[i].code = inputProductCode.value;
        arr[i].CategoryType = inputcatagory.value;
        break;
      }
    }
    localStorage.setItem("ListProducts", JSON.stringify(arr));
    fillData(arr);
  }
  updatePopup.style.display = "none";
}
