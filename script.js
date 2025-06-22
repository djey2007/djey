function noteToPoints(note, maxPoints) {
  const n = parseFloat(note);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(n, maxPoints);
}

function calculate() {
  const cc = parseInt(document.getElementById("continuous").value, 10) || 0;
  const target = parseInt(document.getElementById("target").value, 10) || 400;
  const francais = noteToPoints(document.getElementById("francais").value, 100);
  const maths = noteToPoints(document.getElementById("maths").value, 100);
  const hg = noteToPoints(document.getElementById("hg").value, 50);
  const sciences = noteToPoints(document.getElementById("sciences").value, 50);
  const oral = noteToPoints(document.getElementById("oral").value, 100);

  const total = cc + francais + maths + hg + sciences + oral;
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
  list += `<li>Français : ${francais.toFixed(1)} / 100</li>`;
  list += `<li>Maths : ${maths.toFixed(1)} / 100</li>`;
  list += `<li>Histoire-Géo : ${hg.toFixed(1)} / 50</li>`;
  list += `<li>Sciences : ${sciences.toFixed(1)} / 50</li>`;
  list += `<li>Oral : ${oral.toFixed(1)} / 100</li>`;
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
