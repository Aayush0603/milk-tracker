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
      ${data.status}
      ${data.status === "Pending" ? `<button class="doneBtn" data-id="${r.id}" data-cust="${custId}">Done</button>` : ""}
    </td>
  </tr>
`;

    });
  }
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("doneBtn")) {
    const requestId = e.target.dataset.id;
    const customerId = e.target.dataset.cust;

    await updateDoc(
      doc(db, "customers", customerId, "requests", requestId),
      { status: "Completed" }
    );

    alert("Request marked as completed");
    location.reload();
  }
});
