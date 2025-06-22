function noteToPoints(note, maxPoints) {
  const n = parseFloat(note);
  if (isNaN(n) || n < 0) return 0;
  // On borne la note à 20/20 puis on la ramène à l’échelle maxPoints (100 ou 50)
  return (Math.min(n, 20) / 20) * maxPoints;
}

function calculate() {
  const cc = parseInt(document.getElementById("continuous").value, 10) || 0;
  const target = parseInt(document.getElementById("target").value, 10) || 400;

  const francais  = noteToPoints(document.getElementById("francais").value, 100);
  const maths     = noteToPoints(document.getElementById("maths").value,    100);
  const hg        = noteToPoints(document.getElementById("hg").value,        50);
  const sciences  = noteToPoints(document.getElementById("sciences").value,  50);
  const oral      = noteToPoints(document.getElementById("oral").value,     100);

  const total = cc + francais + maths + hg + sciences + oral;

  const thresholds = [
    { label: "Admis", points: 400 },
    { label: "Mention Assez bien", points: 480 },
    { label: "Mention Bien", points: 560 },
    { label: "Mention Très bien", points: 640 },
  ];

  let html = `<p>Total : ${total.toFixed(1)} / 800</p><ul>`;
  thresholds.forEach(t => {
    if (total >= t.points) {
      html += `<li>${t.label} atteinte !</li>`;
    } else {
      html += `<li>${t.label} : il te manque ${(t.points - total).toFixed(1)} pts</li>`;
    }
  });
  html += "</ul>";

  // Affichage détaillé par matière
  html += "<ul>";
  html += `<li>Français : ${francais.toFixed(1)} / 100</li>`;
  html += `<li>Maths : ${maths.toFixed(1)} / 100</li>`;
  html += `<li>Histoire-Géo : ${hg.toFixed(1)} / 50</li>`;
  html += `<li>Sciences : ${sciences.toFixed(1)} / 50</li>`;
  html += `<li>Oral : ${oral.toFixed(1)} / 100</li>`;
  html += "</ul>";

  // Explication de l’objectif choisi
  const chosen = thresholds.find(t => t.points === target) || thresholds[0];
  const missing = Math.max(target - total, 0);
  const avgNeeded = missing > 0 ? (missing / 400) * 20 : 0;

  if (missing > 0) {
    html += `<p>Pour ${chosen.label}, il te manque ${missing.toFixed(1)} points ` +
            `soit une moyenne de ${avgNeeded.toFixed(1)}/20 aux épreuves finales.</p>`;
  } else {
    html += `<p>${chosen.label} atteinte avec ces notes ! 🎉</p>`;
  }

  document.getElementById("results").innerHTML = html;
  document.getElementById("progressBar").value = total;
}

document.getElementById("calculate").addEventListener("click", calculate);
["continuous", "francais", "maths", "hg", "sciences", "oral", "target"]
  .forEach(id => document.getElementById(id).addEventListener("input", calculate));

window.addEventListener("DOMContentLoaded", calculate);
