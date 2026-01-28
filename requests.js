import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", loadRequests);

async function loadRequests() {
  const tableBody = document.querySelector("#requestTable tbody");
  tableBody.innerHTML = "";

  const customers = await getDocs(collection(db, "customers"));

  for (const cust of customers.docs) {
    const customerName = cust.data().name;
    const custId = cust.id;

    const reqSnap = await getDocs(
      collection(db, "customers", custId, "requests")
    );

    reqSnap.forEach(r => {
      const data = r.data();
tableBody.innerHTML += `
  <tr>
    <td>${customerName}</td>
    <td>${data.date}</td>
    <td>${data.type}</td>
    <td>${data.liters || "-"}</td>
    <td>${data.message || "-"}</td>
    <td>
  <select class="statusSelect" data-id="${r.id}" data-cust="${custId}">
    <option ${data.status === "Pending" ? "selected" : ""}>Pending</option>
    <option ${data.status === "Approved" ? "selected" : ""}>Approved</option>
    <option ${data.status === "Completed" ? "selected" : ""}>Completed</option>
  </select>
</td>
  </tr>
`;

    });
  }
}

document.addEventListener("change", async (e) => {
  if (e.target.classList.contains("statusSelect")) {
    const requestId = e.target.dataset.id;
    const customerId = e.target.dataset.cust;
    const newStatus = e.target.value;

    await updateDoc(
      doc(db, "customers", customerId, "requests", requestId),
      { status: newStatus }
    );

    alert("Status updated to " + newStatus);
  }
});


