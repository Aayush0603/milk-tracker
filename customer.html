import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const mobile = localStorage.getItem("mobile");

// 🥛 SAVE DAILY ENTRY
document.getElementById("saveEntryBtn").addEventListener("click", async () => {
  const date = document.getElementById("date").value;
  const morning = parseFloat(document.getElementById("morning").value) || 0;
  const evening = parseFloat(document.getElementById("evening").value) || 0;

  if (!date) return alert("Select date");

  const month = date.slice(0, 7);

  await setDoc(
    doc(db, "customers", mobile, "milkData", month, "days", date),
    { morning, evening }
  );

  alert("Milk entry saved");
});

// 📩 SEND REQUEST
document.getElementById("requestBtn").addEventListener("click", async () => {
  const date = document.getElementById("requestDate").value;
  const type = document.getElementById("requestType").value;
  const liters = parseFloat(document.getElementById("requestLiters").value) || 0;
  const message = document.getElementById("requestMessage").value;

  if (!date) return alert("Select request date");

  await addDoc(
    collection(db, "customers", mobile, "requests"),
    { date, type, liters, message, status: "Pending" }
  );

  alert("Request sent");
});
