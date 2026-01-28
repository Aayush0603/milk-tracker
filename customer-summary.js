import { db } from "./firebase.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const mobile = localStorage.getItem("mobile");

document.getElementById("calcBtn").addEventListener("click", calculate);

async function calculate() {
  const month = document.getElementById("month").value;
  if (!month) return alert("Select month");

  const tableBody = document.querySelector("#entryTable tbody");
  tableBody.innerHTML = "";

  let totalMilk = 0;

  const snap = await getDocs(
    collection(db, "customers", mobile, "milkData", month, "days")
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

  // get rate
  const custSnap = await getDoc(doc(db, "customers", mobile));
  const rate = custSnap.data().rate || 0;

  document.getElementById("totalMilk").innerText = totalMilk.toFixed(2);
  document.getElementById("totalAmount").innerText =
    (totalMilk * rate).toFixed(2);
}
