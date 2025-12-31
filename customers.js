import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addCustomer = async function () {
  const name = custName.value.trim();
  const mobile = custMobile.value.trim();
  const rate = parseFloat(custRate.value);

  // 🔴 Validation 1: All fields required
  if (!name || !mobile || !rate) {
    alert("Please fill all fields");
    return;
  }

  // 🔴 Validation 2: Mobile must be exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert("Mobile number must be exactly 10 digits");
    return;
  }

  // 🔴 Validation 3: Check if mobile already exists
  const customerRef = doc(db, "customers", mobile);
  const existingCustomer = await getDoc(customerRef);

  if (existingCustomer.exists()) {
    alert("This mobile number is already registered");
    return;
  }

  // ✅ Save new customer
  await setDoc(customerRef, {
    name,
    rate
  });

  alert("Customer added successfully ✅");

  // Clear inputs
  custName.value = "";
  custMobile.value = "";
  custRate.value = "";

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
