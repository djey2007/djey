function noteToPoints(value, max) {
  const n = parseFloat(value);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(n, max);
}

const exams = [
  { id: "francais", label: "Français", max: 100 },
  { id: "maths", label: "Maths", max: 100 },
  { id: "hg", label: "Histoire-Géo", max: 50 },
  { id: "sciences", label: "Sciences", max: 50 },
  { id: "oral", label: "Oral", max: 100 },
];

function calculate() {
  const cc = parseInt(document.getElementById("continuous").value, 10) || 0;
  const target = parseInt(document.getElementById("target").value, 10) || 400;

  const results = exams.map((e) => {
    const input = document.getElementById(e.id);
    return { ...e, points: noteToPoints(input.value, e.max) };
  });

  const examsTotal = results.reduce((sum, r) => sum + r.points, 0);
  const total = cc + examsTotal;

  const thresholds = [
    { label: "Admis", points: 400 },
    { label: "Mention Assez bien", points: 480 },
    { label: "Mention Bien", points: 560 },
    { label: "Mention Très bien", points: 640 },
  ];

  let list = `<p>Total : ${total.toFixed(1)} / 800</p><ul>`;
  thresholds.forEach((t) => {

    if (total >= t.points) {
      list += `<li>${t.label} atteinte !</li>`;
    } else {
      list += `<li>${t.label} : il te manque ${(t.points - total).toFixed(1)} pts</li>`;
    }
  });
  list += "</ul>";
  list += "<ul>";
  results.forEach((r) => {
    list += `<li>${r.label} : ${r.points.toFixed(1)} / ${r.max}</li>`;
  });
  list += "</ul>";
  const chosen = thresholds.find((t) => t.points === target);
  const missing = Math.max(target - total, 0);
  const avgNeeded = missing > 0 ? (missing / 400) * 20 : 0;
  if (missing > 0) {
    list +=
      `<p>Pour ${chosen.label}, il te manque ${missing.toFixed(1)} points ` +
      `soit une moyenne de ${avgNeeded.toFixed(1)}/20 aux épreuves finales.</p>`;
  } else {
    list += `<p>${chosen.label} atteinte avec ces notes !</p>`;
  }
  document.getElementById("results").innerHTML = list;
  document.getElementById("progressBar").value = total;
}

document.getElementById("calculate").addEventListener("click", calculate);

["continuous", "francais", "maths", "hg", "sciences", "oral", "target"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("input", calculate);
  },
);

window.addEventListener("DOMContentLoaded", calculate);
