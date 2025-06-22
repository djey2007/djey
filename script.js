function noteToPoints(note, coefficient) {
  const n = parseFloat(note);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(n, 20) / 20 * coefficient;
}

function calculate() {
  const cc = parseInt(document.getElementById('continuous').value, 10) || 0;
  const francais = noteToPoints(document.getElementById('francais').value, 100);
  const maths = noteToPoints(document.getElementById('maths').value, 100);
  const hg = noteToPoints(document.getElementById('hg').value, 50);
  const sciences = noteToPoints(document.getElementById('sciences').value, 50);
  const oral = noteToPoints(document.getElementById('oral').value, 100);

  const total = cc + francais + maths + hg + sciences + oral;
  const thresholds = [
    { label: 'Admis', points: 400 },
    { label: 'Mention Assez bien', points: 480 },
    { label: 'Mention Bien', points: 560 },
    { label: 'Mention Très bien', points: 640 }
  ];

  let list = `<p>Total : ${total.toFixed(1)} / 800</p><ul>`;
  thresholds.forEach(t => {
    if (total >= t.points) {
      list += `<li>${t.label} atteinte !</li>`;
    } else {
      list += `<li>${t.label} : il te manque ${(t.points - total).toFixed(1)} pts</li>`;
    }
  });
  list += '</ul>';
  document.getElementById('results').innerHTML = list;
}

document.getElementById('calculate').addEventListener('click', calculate);
