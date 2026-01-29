import { db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


window.loadAdminSummary = async function () {
  const table = document.querySelector("#adminSummaryTable tbody");
  table.innerHTML = "";

  const selectedMonth = document.getElementById("adminMonth").value;
  table.innerHTML = `<tr><td colspan="3">Please select a month</td></tr>`;


  const customersSnap = await getDocs(collection(db, "customers"));

  for (const cust of customersSnap.docs) {
    const name = cust.data().name;
    const rate = parseFloat(cust.data().rate) || 0;
    const mobile = cust.id;


    let totalMilk = 0;

    const milkSnap = await getDocs(
      collection(db, "customers", mobile, "milkData", selectedMonth, "days")
    );

    milkSnap.forEach(d => {
      const data = d.data();
      totalMilk += (data.morning || 0) + (data.evening || 0);
    });
    console.log(name, rate, totalMilk);
    
    const amount = totalMilk * rate;

table.innerHTML += `
  <tr>
    <td>${name}</td>
    <td>${totalMilk.toFixed(2)}</td>
    <td>₹ ${amount.toFixed(2)}</td>
  </tr>
`;

  }
}






