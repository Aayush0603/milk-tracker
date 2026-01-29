import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  collectionGroup
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
  const editBtn = e.target.closest(".editBtn");
if (editBtn) {
  const oldId = editBtn.dataset.id;


  const snap = await getDoc(doc(db, "customers", oldId));
  const data = snap.data();

  const newName = prompt("Enter new name:", data.name);
  const newRate = prompt("Enter new rate:", data.rate);
  const newMobile = prompt("Enter new mobile number:", oldId);
  console.log("Editing", oldId, "→", newMobile);


  if (newName === null || newRate === null || newMobile === null) return;

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

console.log("Starting milk migration...");

// 1️⃣ Move Requests
const oldReqSnap = await getDocs(collection(db, "customers", oldId, "requests"));
for (const req of oldReqSnap.docs) {
  await setDoc(doc(db, "customers", newMobile, "requests", req.id), req.data());
  await deleteDoc(req.ref);
}

// 2️⃣ Move ALL milk day records using collectionGroup
const daysSnap = await getDocs(collectionGroup(db, "days"));

for (const dayDoc of daysSnap.docs) {
  const path = dayDoc.ref.path;

  // customers/{oldId}/milkData/{month}/days/{date}
  const parts = path.split("/");

  if (parts[1] === oldId) {
    const monthId = parts[3];
    const dateId = parts[5];

    console.log("Moving:", path);

    await setDoc(
      doc(db, "customers", newMobile, "milkData", monthId, "days", dateId),
      dayDoc.data()
    );

    await deleteDoc(dayDoc.ref);
  }
}

console.log("Milk migration finished");

// 3️⃣ Delete old customer doc
await deleteDoc(doc(db, "customers", oldId));


    // Delete empty month docs
for (const monthDoc of monthsSnap.docs) {
  await deleteDoc(doc(db, "customers", oldId, "milkData", monthDoc.id));
}


  // 🔄 MIGRATE REQUESTS
  const reqSnap = await getDocs(collection(db, "customers", oldId, "requests"));
  for (const req of reqSnap.docs) {
    await setDoc(
      doc(db, "customers", newMobile, "requests", req.id),
      req.data()
    );
  }

  // 🗑 Delete old requests
  for (const req of reqSnap.docs) {
    await deleteDoc(doc(db, "customers", oldId, "requests", req.id));
  }

  // 🗑 Delete old customer document
  await deleteDoc(doc(db, "customers", oldId));

  alert("Customer mobile updated and all records migrated");
  loadCustomers();
}

  // 🗑 DELETE
  const deleteBtn = e.target.closest(".deleteBtn");
if (deleteBtn) {
  const id = deleteBtn.dataset.id;


    if (!confirm("Delete this customer?")) return;

    await deleteDoc(doc(db, "customers", id));

    alert("Customer deleted");
    loadCustomers();
  }

});












