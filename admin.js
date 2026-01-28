import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", loadCustomers);

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
