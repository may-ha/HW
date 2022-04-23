const popUps = document.querySelectorAll(".popup");
const popUpInner = document.querySelectorAll(".popup .inner");
var invent = [];
$(document).ready(function () {
  getInventory();
});

function getInventory() {
  fetch("https://localhost:7039/api/Mission/Getinventory")
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
const arr = JSON.parse(localStorage.getItem("ListInv")) || [];

if (localStorage.getItem("ListInv")) {
  let arr = JSON.parse(localStorage.getItem("ListInv"));
  fillData(arr);
}

let idU = 1;
function addInventory(btn) {
  const formElem = btn.closest(".add-inventory");

  const q = formElem.querySelector('input[name="quantity"]').value;
  const c = formElem.querySelector('input[name="code"]').value;

  let isFound = false;

  if (localStorage.getItem("ListInv")) {
    let arr = JSON.parse(localStorage.getItem("ListInv"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].code) === Number(c)) {
        isFound = true;
        break;
      }
    }
  }

  if (isFound) {
    alert("Inventory Can not be With the same Code");
  } else {
    const InventoryObj = {
      code: c,
      quantity: q,
      addedDate: new Date().toLocaleString(),
    };

    arr.push(InventoryObj);
    fetch("https://localhost:7039/api/Mission/Addinventory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(InventoryObj),
    })
      .then((response) => response.json())
      .then(() => {
        getInventory();
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
  invent = arr;
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
    deleteBtn.addEventListener("click", deleteInventory);

    const editBtn = document.createElement("i");
    editBtn.classList.add("fa-solid", "fa-pen-to-square");
    editBtn.addEventListener("click", showUpInventory);

    lastTd.appendChild(editBtn);
    lastTd.appendChild(deleteBtn);

    tr.appendChild(lastTd);

    dataTable.appendChild(tr);
  }
}

let InventoryID_outside;
function deleteInventory(e) {
  const thisID = Number(e.target.closest("tr").id);
  const tr = e.target.closest("tr");
  const codeTd = Number(tr.querySelector("#code").innerHTML);

  fetch(`https://localhost:7039/api/Mission/DeleteInventory?id=${thisID}`, {
    method: "DELETE",
  })
    .then(() => getInventory())
    .catch((error) => console.error("Unable to delete item.", error));
  localStorage.setItem("List", JSON.stringify(arr));
  fillData(arr);
}

let orginalCodeVal;

function showUpInventory(e) {
  const updatePopup = document.querySelector(".update-pop");
  updatePopup.style.display = "block";

  const tr = e.target.closest("tr");
  InventoryID_outside = Number(tr.id);
  const codeTdVal = Number(tr.querySelector("#code").innerHTML);
  const quantityTdVal = tr.querySelector("#quantity").innerHTML;

  orginalCodeVal = codeTdVal;

  const inputCode = updatePopup.querySelector('input[name="code"]');
  const inputQuantity = updatePopup.querySelector('input[name="quantity"]');

  inputCode.value = codeTdVal;
  inputQuantity.value = quantityTdVal;
}

function updateInventory() {
  const updatePopup = document.querySelector(".update-pop");
  const inputCode = updatePopup.querySelector('input[name="code"]');
  const inputQuantity = updatePopup.querySelector('input[name="quantity"]');
  var inventory = {
    id: InventoryID_outside,
  };
  var inventory = invent.find((x) => x.id == InventoryID_outside);
  if (!inventory) {
    alert("Inventory not found");
    return;
  }
  inventory.code = inputCode.value;
  inventory.quantity = inputQuantity.value;
  fetch(`https://localhost:7039/api/Mission/updateinventory`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventory),
  })
    .then(() => getInventory())
    .catch((error) => console.error("Unable to update item.", error));

  if (localStorage.getItem("ListInv")) {
    let arr = JSON.parse(localStorage.getItem("ListInv"));
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i].code) === orginalCodeVal) {
        arr[i].code = inputCode.value;
        arr[i].quantity = inputQuantity.value;
        break;
      }
    }
    localStorage.setItem("ListInv", JSON.stringify(arr));
    fillData(arr);
  }

  updatePopup.style.display = "none";
}
