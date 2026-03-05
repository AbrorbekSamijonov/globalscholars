// ============================================
// GLOBAL SCHOLARS PREP — script.js
// ============================================

const GS_SHEET_URL = "https://script.google.com/macros/s/AKfycbzcaCXy4A_MhEy1KYQYx59bweM8Lz7akHeyADnGVWpr_alsFAPvQfQon17Rq0UFCMtN/exec";

// --- Smooth scroll ---
function gsScrollTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {

  // --- Carousel ---
  var pills   = document.querySelectorAll(".gs-car-pill");
  var track   = document.querySelector(".gs-car-track");
  var carDots = document.querySelectorAll(".gs-car-dot");
  var prevBtn = document.getElementById("carPrev");
  var nextBtn = document.getElementById("carNext");
  var total   = pills.length;
  var current = 0;
  var autoTimer;

  function goTo(index) {
    if (!track) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    // Trigger slide transition
    track.style.transition = "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)";
    track.style.transform = "translateX(-" + (current * 100) + "%)";

    // Content entrance animation
    track.classList.remove("is-animating");
    void track.offsetWidth; // force reflow
    track.classList.add("is-animating");
    setTimeout(function() { track.classList.remove("is-animating"); }, 600);

    pills.forEach(function(p) { p.classList.remove("active"); });
    carDots.forEach(function(d) { d.classList.remove("active"); });
    pills[current].classList.add("active");
    carDots[current].classList.add("active");
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current + 1); }, 5500);
  }

  if (track && pills.length > 0) {
    pills.forEach(function(pill) {
      pill.addEventListener("click", function() {
        goTo(parseInt(pill.dataset.tab));
        resetTimer();
      });
    });

    carDots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        goTo(parseInt(dot.dataset.dot));
        resetTimer();
      });
    });

    if (prevBtn) prevBtn.addEventListener("click", function() { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener("click", function() { goTo(current + 1); resetTimer(); });

    var touchStartX = 0;
    var viewport = document.querySelector(".gs-car-viewport");
    if (viewport) {
      viewport.addEventListener("touchstart", function(e) { touchStartX = e.touches[0].clientX; });
      viewport.addEventListener("touchend", function(e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
      });
    }

    resetTimer();
  }

  // --- Form submit ---
  var form = document.getElementById("apply-form");
  if (!form) return;
  var btn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    btn.textContent = "Yuborilmoqda...";
    btn.disabled = true;
    btn.style.opacity = "0.8";

    var formData = {
      fullName:  form.fullName.value,
      birthdate: form.birthdate.value,
      grade:     form.grade.value,
      telegram:  form.telegram.value,
      phone:     form.phone.value,
    };

    // URLSearchParams works reliably with Apps Script + no-cors
    var params = new URLSearchParams(formData);

    fetch(GS_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then(function () {
        btn.textContent = "✓ Ariza qabul qilindi!";
        btn.style.background = "linear-gradient(135deg, #1a7a3c, #2da85a)";
        btn.style.opacity = "1";
        btn.disabled = true;
        form.reset();
      })
      .catch(function (err) {
        btn.textContent = "Xatolik — qayta urinib ko'ring";
        btn.style.background = "linear-gradient(135deg, #8b2020, #c03030)";
        btn.style.opacity = "1";
        btn.disabled = false;
        console.error("Submission error:", err);
      });
  });

});