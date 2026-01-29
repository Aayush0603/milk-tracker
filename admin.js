import { db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function loadAdminSummary() {
  const table = document.querySelector("#adminSummaryTable tbody");
  table.innerHTML = "";

  const selectedMonth = document.getElementById("adminMonth").value;
  if (!selectedMonth) return alert("Select month");

  const customersSnap = await getDocs(collection(db, "customers"));

  for (const cust of customersSnap.docs) {
    const name = cust.data().name;
    const mobile = cust.id;

    let totalMilk = 0;

    const milkSnap = await getDocs(
      collection(db, "customers", mobile, "milkData", selectedMonth, "days")
    );

    milkSnap.forEach(d => {
      const data = d.data();
      totalMilk += (data.morning || 0) + (data.evening || 0);
    });

    table.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${totalMilk.toFixed(2)}</td>
      </tr>
    `;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  loadAdminSummary();
});

async function loadCustomers() {
  const select = document.getElementById("selectedCustomer");

  const snap = await getDocs(collection(db, "customers"));

  select.innerHTML = `<option value="">-- Select Customer --</option>`;

  snap.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = doc.data().name;
    select.appendChild(opt);
  });
}
