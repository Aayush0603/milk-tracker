import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSummaryCustomers();
  document.getElementById("calcBtn").addEventListener("click", calculate);
});

async function loadSummaryCustomers() {
  const select = document.getElementById("summaryCustomer");
  select.innerHTML = `<option value="">-- Select Customer --</option>`;

  const snap = await getDocs(collection(db, "customers"));

  snap.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.data().name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    if (select.value) loadCustomerRate(select.value);
  });
}

async function loadCustomerRate(customerId) {
  const rateInput = document.getElementById("rate");
  const snap = await getDoc(doc(db, "customers", customerId));
  if (snap.exists()) {
    rateInput.value = snap.data().rate;
  }
}

async function calculate() {
  const customer = document.getElementById("summaryCustomer").value;
  const month = document.getElementById("month").value;
  const rate = parseFloat(document.getElementById("rate").value) || 0;
  const tableBody = document.querySelector("#entryTable tbody");

  if (!customer || !month) {
    alert("Select customer and month");
    return;
  }

  tableBody.innerHTML = "";
  let totalMilk = 0;

  const snap = await getDocs(
    collection(db, "customers", customer, "milkData", month, "days")
  );

  snap.forEach(d => {
    const { morning, evening } = d.data();
    const total = morning + evening;
    totalMilk += total;

    tableBody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${morning}</td>
        <td>${evening}</td>
        <td>${total.toFixed(2)}</td>
      </tr>
    `;
  });

  document.getElementById("totalMilk").innerText = totalMilk.toFixed(2);
  document.getElementById("totalAmount").innerText =
    (totalMilk * rate).toFixed(2);
}
