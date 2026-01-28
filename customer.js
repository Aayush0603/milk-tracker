import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const mobile = localStorage.getItem("mobile");

document.getElementById("saveEntryBtn").addEventListener("click", async () => {
  const date = dateInput.value;
  const morning = parseFloat(morningInput.value) || 0;
  const evening = parseFloat(eveningInput.value) || 0;

  if (!date) return alert("Select date");

  const month = date.slice(0,7);

  await setDoc(
    doc(db, "customers", mobile, "milkData", month, "days", date),
    { morning, evening }
  );

  alert("Milk entry saved");
});

document.getElementById("requestBtn").addEventListener("click", async () => {
  const date = requestDate.value;
  const type = requestType.value;
  const liters = parseFloat(requestLiters.value) || 0;
  const message = requestMessage.value;

  await addDoc(
    collection(db, "customers", mobile, "requests"),
    { date, type, liters, message, status: "Pending" }
  );

  alert("Request sent");
});
