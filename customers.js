import { db } from "./firebase.js";
import {
  doc, setDoc, getDocs, collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addCustomer = async function () {
  const name = custName.value;
  const mobile = custMobile.value;
  const rate = parseFloat(custRate.value);

  if (!name || !mobile || !rate) {
    alert("Fill all fields");
    return;
  }

  await setDoc(doc(db, "customers", mobile), {
    name,
    rate
  });

  alert("Customer added ✅");
  loadCustomers();
};

async function loadCustomers() {
  const list = document.getElementById("customerList");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "customers"));
  snap.forEach(d => {
    list.innerHTML += `<li>${d.data().name} (${d.id})</li>`;
  });
}

loadCustomers();
