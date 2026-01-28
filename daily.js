import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



let currentCustomer = null;

document.addEventListener("DOMContentLoaded", () => {
  loadCustomersForDaily();

  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", saveEntry);

  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.valueAsDate = new Date();

  document.getElementById("requestBtn").addEventListener("click", sendRequest);

});

// 🔹 LOAD CUSTOMERS INTO DAILY DROPDOWN
async function loadCustomersForDaily() {
  const select = document.getElementById("selectedCustomer");
  select.innerHTML = `<option value="">-- Select Customer --</option>`;

  const snap = await getDocs(collection(db, "customers"));

  snap.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id; // mobile number
    opt.textContent = d.data().name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    currentCustomer = select.value;
  });
}

// 🔹 SAVE DAILY ENTRY
async function saveEntry() {
  if (!currentCustomer) {
    alert("Please select a customer");
    return;
  }

  const date = document.getElementById("date").value;
  const morning = parseFloat(document.getElementById("morning").value) || 0;
  const evening = parseFloat(document.getElementById("evening").value) || 0;

  if (!date) {
    alert("Please select date");
    return;
  }

  const month = date.slice(0, 7);

  // Check for request on this date
const reqSnap = await getDocs(
  collection(db, "customers", currentCustomer, "requests")
);

let finalMorning = morning;
let finalEvening = evening;

reqSnap.forEach(r => {
  const data = r.data();
  if (data.date === date && data.status === "Pending") {
    if (data.type === "No Milk") {
      finalMorning = 0;
      finalEvening = 0;
    }
    if (data.type === "Extra Milk") {
      finalMorning += data.liters || 0;
    }
  }
});

  await setDoc(
  doc(db, "customers", currentCustomer, "milkData", month, "days", date),
  { morning: finalMorning, evening: finalEvening }
);
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
