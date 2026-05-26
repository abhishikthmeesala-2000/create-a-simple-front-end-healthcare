const concernData = {
  refill: {
    level: "Routine",
    title: "Medication refill",
    text:
      "Refills are usually handled within one business day. We can send the request to the pharmacy queue right away.",
    button: "Send refill request",
    status: "On track",
    statusClass: "status-good",
  },
  fever: {
    level: "Needs review",
    title: "Fever or flu symptoms",
    text:
      "Start with rest, fluids, and home temperature checks. If symptoms worsen or become severe, schedule same-day clinical review.",
    button: "Request nurse call",
    status: "Watch closely",
    statusClass: "status-neutral",
  },
  "blood-pressure": {
    level: "Monitor",
    title: "Blood pressure check",
    text:
      "Log your readings for the next three days. If values stay elevated, the care team can adjust your follow-up plan.",
    button: "Log readings",
    status: "Monitoring",
    statusClass: "status-neutral",
  },
  insurance: {
    level: "Admin support",
    title: "Insurance or billing help",
    text:
      "We can review claim details, payment questions, and coverage notes so the billing team can follow up efficiently.",
    button: "Open support ticket",
    status: "In progress",
    statusClass: "status-good",
  },
};

const concernSelect = document.getElementById("concernSelect");
const triageLevel = document.getElementById("triageLevel");
const triageTitle = document.getElementById("triageTitle");
const triageText = document.getElementById("triageText");
const triageButton = document.getElementById("triageButton");
const triageCard = document.getElementById("triageCard");
const connectionStatus = document.getElementById("connectionStatus");
const refreshStatus = document.getElementById("refreshStatus");
const resetTriage = document.getElementById("resetTriage");
const actionNote = document.getElementById("actionNote");
const nextAppointmentLabel = document.getElementById("nextAppointmentLabel");
const nextAppointmentCountdown = document.getElementById("nextAppointmentCountdown");

const appointmentSlots = [
  { label: "9:00 AM", hour: 9, minute: 0 },
  { label: "11:30 AM", hour: 11, minute: 30 },
  { label: "2:30 PM", hour: 14, minute: 30 },
  { label: "4:00 PM", hour: 16, minute: 0 },
];

function updateConcernState(value) {
  const data = concernData[value] ?? concernData.refill;

  triageLevel.textContent = data.level;
  triageLevel.className = `status ${data.statusClass}`;
  triageTitle.textContent = data.title;
  triageText.textContent = data.text;
  triageButton.textContent = data.button;
  connectionStatus.textContent = data.status;
  actionNote.textContent = `Ready to ${data.button.toLowerCase()}.`;

  triageCard.animate(
    [
      { transform: "translateY(0)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
      {
        transform: "translateY(-2px)",
        boxShadow: "0 20px 34px rgba(23, 41, 35, 0.08)",
      },
      { transform: "translateY(0)", boxShadow: "none" },
    ],
    {
      duration: 320,
      easing: "ease-out",
    },
  );
}

function formatCountdown(targetDate) {
  const diffMinutes = Math.max(0, Math.round((targetDate - new Date()) / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (diffMinutes === 0) {
    return "starts now";
  }

  if (hours === 0) {
    return `in ${minutes}m`;
  }

  return `in ${hours}h ${minutes}m`;
}

function updateNextAppointment() {
  const now = new Date();
  const today = new Date(now);
  today.setSeconds(0, 0);

  const upcomingSlots = appointmentSlots
    .map((slot) => {
      const date = new Date(today);
      date.setHours(slot.hour, slot.minute, 0, 0);
      return { ...slot, date };
    })
    .filter((slot) => slot.date > now);

  const nextSlot =
    upcomingSlots[0] ??
    (() => {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(appointmentSlots[0].hour, appointmentSlots[0].minute, 0, 0);
      return { ...appointmentSlots[0], date: tomorrow };
    })();

  nextAppointmentLabel.textContent = nextSlot.label;
  nextAppointmentCountdown.textContent = formatCountdown(nextSlot.date);
}

concernSelect.addEventListener("change", (event) => {
  updateConcernState(event.target.value);
});

triageButton.addEventListener("click", () => {
  actionNote.textContent = `${triageButton.textContent} submitted. A care team member will follow up shortly.`;
  connectionStatus.textContent = "Synced";
  connectionStatus.className = "status status-good";
});

resetTriage.addEventListener("click", () => {
  concernSelect.value = "refill";
  updateConcernState("refill");
  refreshStatus.textContent = "Refresh status";
});

refreshStatus.addEventListener("click", () => {
  connectionStatus.textContent = "Refreshing";
  connectionStatus.className = "status status-good";
  refreshStatus.textContent = "Updating...";
  window.setTimeout(() => {
    connectionStatus.textContent = "Stable";
    refreshStatus.textContent = "Refresh status";
  }, 1000);
});

updateConcernState(concernSelect.value);
updateNextAppointment();
window.setInterval(updateNextAppointment, 60000);
