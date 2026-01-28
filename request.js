import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentCustomer = null;

document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();

  document.getElementById("requestBtn").addEventListener("click", sendRequest);
});

async function loadCustomers() {
  const select = document.getElementById("selectedCustomer");
  select.innerHTML = `<option value="">-- Select Customer --</option>`;

  const snap = await getDocs(collection(db, "customers"));

  snap.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.data().name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    currentCustomer = select.value;
  });
}

async function sendRequest() {
  if (!currentCustomer) {
    alert("Select customer first");
    return;
  }

  const date = requestDate.value;
  const type = requestType.value;
  const liters = parseFloat(requestLiters.value) || 0;
  const message = requestMessage.value.trim();

  if (!date) {
    alert("Select request date");
    return;
  }

  await addDoc(
    collection(db, "customers", currentCustomer, "requests"),
    { date, type, liters, message, status: "Pending" }
  );

  alert("Request sent ✅");

  requestDate.value = "";
  requestLiters.value = "";
  requestMessage.value = "";
}
