import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction,
  increment, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* ✅ Firebase Config (بتاعك) */
const firebaseConfig = {
  apiKey: "AIzaSyBn9gQSnDNIg35fgjBkMT3SaQ9MJ0zxWLo",
  authDomain: "mohamed-portfolio-fd13f.firebaseapp.com",
  projectId: "mohamed-portfolio-fd13f",
  storageBucket: "mohamed-portfolio-fd13f.firebasestorage.app",
  messagingSenderId: "590586755943",
  appId: "1:590586755943:web:a7d2013c4893df87ad4dc2",
  measurementId: "G-5LKHN5VWML"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ========= Helpers ========= */
function getVisitorId(){
  const key = "visitor_id_v1";
  let id = localStorage.getItem(key);
  if(!id){
    id = (crypto?.randomUUID?.() || (Date.now()+"_"+Math.random().toString(16).slice(2)));
    localStorage.setItem(key, id);
  }
  return id;
}
const VISITOR_ID = getVisitorId();

/* ========= Popup (Fixed) ========= */
const popup = document.getElementById("ratingPopup");
const popupText = document.getElementById("popupText");
const popupClose = document.getElementById("popupClose");

function showPopup(msg){
  if (!popup) return;
  if (popupText) popupText.textContent = msg || "Done.";
  popup.classList.add("open");
  popup.setAttribute("aria-hidden", "false");
}
function hidePopup(){
  if (!popup) return;
  popup.classList.remove("open");
  popup.setAttribute("aria-hidden", "true");
}
popupClose?.addEventListener("click", hidePopup);
popup?.addEventListener("click", (e) => {
  const card = e.target.closest(".popup-card");
  if (!card) hidePopup();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hidePopup();
});

/* ========= Visits Counter (Global) ========= */
const visitsCountEl = document.getElementById("visitsCount");
const visitsHintEl  = document.getElementById("visitsHint");

const visitsDocRef = doc(db, "stats", "visits");
const visitsUniqueRef = doc(db, "visits_unique", VISITOR_ID);

async function initVisits(){
  try{
    // unique once per visitor
    const seen = await getDoc(visitsUniqueRef);
    if(!seen.exists()){
      await setDoc(visitsUniqueRef, { createdAt: Date.now() }, { merge:true });
      await setDoc(visitsDocRef, { total: 0 }, { merge:true });
      await updateDoc(visitsDocRef, { total: increment(1) });
    }

    // live listen
    onSnapshot(visitsDocRef, (snap) => {
      const total = snap.data()?.total ?? 0;
      if (visitsCountEl) visitsCountEl.textContent = total.toLocaleString();
      if (visitsHintEl) visitsHintEl.style.opacity = "0.75";
    });
  }catch(e){
    console.warn("Visits error:", e);
    if (visitsCountEl) visitsCountEl.textContent = "—";
  }
}
initVisits();

/* ========= Rating (Global) ========= */
const ratingDocRef = doc(db, "ratings", "global");
const voteDocRef   = doc(db, "ratings_votes", VISITOR_ID);

const avgRateEl   = document.getElementById("avgRate");
const totalRatesEl= document.getElementById("totalRates");

const bars = {
  1: document.getElementById("bar1"),
  2: document.getElementById("bar2"),
  3: document.getElementById("bar3"),
  4: document.getElementById("bar4"),
  5: document.getElementById("bar5"),
};
const nums = {
  1: document.getElementById("n1"),
  2: document.getElementById("n2"),
  3: document.getElementById("n3"),
  4: document.getElementById("n4"),
  5: document.getElementById("n5"),
};

const starPicker = document.getElementById("starPicker");
const starBtns   = starPicker ? [...starPicker.querySelectorAll(".star-btn")] : [];
const ratingNote = document.getElementById("ratingNote");
const uidHint    = document.getElementById("uidHint");

if(uidHint) uidHint.textContent = `ID: ${VISITOR_ID.slice(0,8)}…`;

function setStarsUI(activeCount){
  starBtns.forEach((b, i) => {
    const on = (i+1) <= activeCount;
    b.classList.toggle("active", on);
  });
}

function lockStars(){
  starBtns.forEach(b => b.disabled = true);
  if (ratingNote) ratingNote.textContent = document.documentElement.lang === "ar"
    ? "تم حفظ تقييمك ✅"
    : "Your rating is saved ✅";
}

function unlockStars(){
  starBtns.forEach(b => b.disabled = false);
}

/* Live read global rating */
function updateUIFromData(d){
  const total = d?.totalVotes ?? 0;
  const sum   = d?.sumStars ?? 0;
  const avg   = total ? (sum / total) : 0;

  if(avgRateEl) avgRateEl.textContent = avg ? avg.toFixed(1) : "0.0";
  if(totalRatesEl) totalRatesEl.textContent = total.toLocaleString();

  // per star counts
  const c1 = d?.c1 ?? 0;
  const c2 = d?.c2 ?? 0;
  const c3 = d?.c3 ?? 0;
  const c4 = d?.c4 ?? 0;
  const c5 = d?.c5 ?? 0;

  const map = {1:c1,2:c2,3:c3,4:c4,5:c5};
  const max = Math.max(1, total);

  for(const s of [1,2,3,4,5]){
    if(nums[s]) nums[s].textContent = String(map[s] ?? 0);
    const pct = ((map[s] ?? 0) / max) * 100;
    if(bars[s]) bars[s].style.width = `${pct}%`;
  }
}

async function ensureRatingDoc(){
  const snap = await getDoc(ratingDocRef);
  if(!snap.exists()){
    await setDoc(ratingDocRef, {
      totalVotes: 0,
      sumStars: 0,
      c1: 0, c2: 0, c3: 0, c4: 0, c5: 0,
      updatedAt: Date.now()
    }, { merge:true });
  }
}

await ensureRatingDoc();

onSnapshot(ratingDocRef, (snap) => {
  updateUIFromData(snap.data() || {});
});

/* Check if already voted */
async function initVoteState(){
  const v = await getDoc(voteDocRef);
  if(v.exists()){
    const stars = v.data()?.stars ?? 0;
    if(stars) setStarsUI(stars);
    lockStars();
  }else{
    unlockStars();
    setStarsUI(0);
  }
}
initVoteState();

/* Click stars */
starBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    const star = Number(btn.getAttribute("data-star") || 0);
    if(!star || star < 1 || star > 5) return;

    // animation
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");

    setStarsUI(star);

    try{
      await runTransaction(db, async (tx) => {
        const voteSnap = await tx.get(voteDocRef);
        if(voteSnap.exists()){
          throw new Error("already_voted");
        }

        const globalSnap = await tx.get(ratingDocRef);
        if(!globalSnap.exists()){
          tx.set(ratingDocRef, {
            totalVotes: 0,
            sumStars: 0,
            c1: 0, c2: 0, c3: 0, c4: 0, c5: 0,
            updatedAt: Date.now()
          }, { merge:true });
        }

        // create vote
        tx.set(voteDocRef, {
          stars: star,
          createdAt: Date.now()
        });

        // update global
        const incField = `c${star}`;
        tx.update(ratingDocRef, {
          totalVotes: increment(1),
          sumStars: increment(star),
          [incField]: increment(1),
          updatedAt: Date.now()
        });
      });

      lockStars();
      showPopup(document.documentElement.lang === "ar"
        ? "تم حفظ تقييمك بنجاح ✅"
        : "Your rating has been saved ✅"
      );
    }catch(e){
      if(String(e?.message || "").includes("already_voted")){
        lockStars();
        showPopup(document.documentElement.lang === "ar"
          ? "أنت قيّمت بالفعل ✅"
          : "You already rated ✅"
        );
        return;
      }
      console.warn("Rating error:", e);
      showPopup(document.documentElement.lang === "ar"
        ? "حصل خطأ. حاول مرة أخرى."
        : "Something went wrong. Try again."
      );
    }
  });
});