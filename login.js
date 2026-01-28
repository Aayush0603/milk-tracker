import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function () {
  const mobile = mobileInput();

  if (!/^[0-9]{10}$/.test(mobile)) {
    alert("Enter valid 10-digit number");
    return;
  }

  // Check admin
  const adminSnap = await getDoc(doc(db, "admins", mobile));
  if (adminSnap.exists()) {
    localStorage.setItem("role", "admin");
    localStorage.setItem("mobile", mobile);
    window.location.href = "admin.html";
    return;
  }

  // Check customer
  const custSnap = await getDoc(doc(db, "customers", mobile));
  if (custSnap.exists()) {
    localStorage.setItem("role", "customer");
    localStorage.setItem("mobile", mobile);
    window.location.href = "request.html";
    return;
  }

  alert("Mobile not registered");
};

function mobileInput() {
  return document.getElementById("mobile").value.trim();
}

