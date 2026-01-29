import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  updateDoc,
  deleteDoc
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
  const data = d.data();
  list.innerHTML += `
    <li>
      ${data.name} (${d.id}) — ₹${data.rate}
      <button class="editBtn" data-id="${d.id}">✏</button>
      <button class="deleteBtn" data-id="${d.id}">🗑</button>
    </li>
  `;
});

}

loadCustomers();

document.addEventListener("click", async (e) => {

  // ✏ EDIT
  if (e.target.classList.contains("editBtn")) {
  const oldId = e.target.dataset.id;

  const snap = await getDoc(doc(db, "customers", oldId));
  const data = snap.data();

  const newName = prompt("Enter new name:", data.name);
  const newRate = prompt("Enter new rate:", data.rate);
  const newMobile = prompt("Enter new mobile number:", oldId);

  if (!newName || !newRate || !newMobile) return;

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(newMobile)) {
    alert("Mobile must be 10 digits");
    return;
  }

  // If mobile unchanged → normal update
  if (newMobile === oldId) {
    await updateDoc(doc(db, "customers", oldId), {
      name: newName,
      rate: parseFloat(newRate)
    });

    alert("Customer updated");
    loadCustomers();
    return;
  }

  // Check new mobile not already used
  const existing = await getDoc(doc(db, "customers", newMobile));
  if (existing.exists()) {
    alert("Mobile already exists");
    return;
  }

  // 🔄 Create new customer doc
  await setDoc(doc(db, "customers", newMobile), {
    name: newName,
    rate: parseFloat(newRate)
  });

  // 🔄 MIGRATE MILK DATA
  const milkMonths = await getDocs(collection(db, "customers", oldId, "milkData"));
  for (const monthDoc of milkMonths.docs) {
    const monthId = monthDoc.id;

    const daysSnap = await getDocs(collection(db, "customers", oldId, "milkData", monthId, "days"));

    for (const day of daysSnap.docs) {
      await setDoc(
        doc(db, "customers", newMobile, "milkData", monthId, "days", day.id),
        day.data()
      );
    }
  }

  // 🔄 MIGRATE REQUESTS
  const reqSnap = await getDocs(collection(db, "customers", oldId, "requests"));
  for (const req of reqSnap.docs) {
    await setDoc(
      doc(db, "customers", newMobile, "requests", req.id),
      req.data()
    );
  }

  // 🗑 Delete old subcollections (milk + requests)
  for (const monthDoc of milkMonths.docs) {
    const monthId = monthDoc.id;
    const daysSnap = await getDocs(collection(db, "customers", oldId, "milkData", monthId, "days"));
    for (const day of daysSnap.docs) {
      await deleteDoc(doc(db, "customers", oldId, "milkData", monthId, "days", day.id));
    }
  }

  for (const req of reqSnap.docs) {
    await deleteDoc(doc(db, "customers", oldId, "requests", req.id));
  }

  // 🗑 Delete old customer document
  await deleteDoc(doc(db, "customers", oldId));

  alert("Customer mobile updated and all records migrated");
  loadCustomers();
}

  // 🗑 DELETE
  if (e.target.classList.contains("deleteBtn")) {
    const id = e.target.dataset.id;

    if (!confirm("Delete this customer?")) return;

    await deleteDoc(doc(db, "customers", id));

    alert("Customer deleted");
    loadCustomers();
  }

});



