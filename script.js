import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



let currentCustomer = null;

async function loadCustomerDropdown() {
  const select = document.getElementById("selectedCustomer");
  if (!select) return;

  select.innerHTML = `<option value="">-- Select Customer --</option>`;

  const snap = await getDocs(collection(db, "customers"));

  snap.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;              // mobile number
    opt.textContent = d.data().name;
    select.appendChild(opt);
  });

  // ✅ SET DEFAULT CUSTOMER
  if (select.options.length > 1) {
    select.selectedIndex = 1;      // select first real customer
    currentCustomer = select.value;
    loadDashboardForCustomer();
  }

  select.addEventListener("change", () => {
    currentCustomer = select.value;
    loadDashboardForCustomer();
  });
}


// --------------------
// Bind buttons
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveEntry);

  const calcBtn = document.getElementById("calcBtn");
  if (calcBtn) calcBtn.addEventListener("click", calculate);

  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.valueAsDate = new Date();

  loadCustomerDropdown(); 
  loadSummaryCustomers();


});

// --------------------
// Save to Firebase
// --------------------
async function saveEntry() {
  const date = document.getElementById("date").value;
  const morning = parseFloat(document.getElementById("morning").value) || 0;
  const evening = parseFloat(document.getElementById("evening").value) || 0;

  if (!currentCustomer) {
    alert("Please select a customer");
    return;
  }

  if (!date) {
    alert("Please select date");
    return;
  }

  const month = date.slice(0, 7);

  await setDoc(
    doc(db, "customers", currentCustomer, "milkData", month, "days", date),
    { morning, evening }
  );

  alert("Saved successfully ✅"); // ✅ ONLY ONE ALERT
}



// --------------------
// Read from Firebase
// --------------------
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

async function loadDashboardForCustomer(rate = 60) {
  if (!currentCustomer) return;

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  let todayMilk = 0;
  let monthMilk = 0;

  const snap = await getDocs(
    collection(db, "customers", currentCustomer, "milkData", month)
  );

  snap.forEach(d => {
    const { morning, evening } = d.data();
    const total = morning + evening;
    monthMilk += total;

    if (d.id === today) {
      todayMilk = total;
    }
  });

  document.getElementById("todayMilk").innerText = todayMilk.toFixed(2);
  document.getElementById("monthMilk").innerText = monthMilk.toFixed(2);
  document.getElementById("monthAmount").innerText =
    (monthMilk * rate).toFixed(2);
}

async function loadSummaryCustomers() {
  const select = document.getElementById("summaryCustomer");
  if (!select) return;

  select.innerHTML = "";

  const snap = await getDocs(collection(db, "customers"));

  snap.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.data().name;
    select.appendChild(opt);
  });

  // Auto-load first customer rate
  if (select.options.length > 0) {
    loadCustomerRate(select.value);
  }

  select.addEventListener("change", () => {
    loadCustomerRate(select.value);
  });
}


async function loadCustomerRate(customerId) {
  const rateInput = document.getElementById("rate");
  if (!rateInput) return;

  const snap = await getDoc(doc(db, "customers", customerId));

  if (snap.exists()) {
    rateInput.value = snap.data().rate;
  }
}

