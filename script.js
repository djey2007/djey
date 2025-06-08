function ipToInt(ip) {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
}

function intToIp(int) {
  return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join('.');
}

function maskToPrefix(maskStr) {
  const maskInt = ipToInt(maskStr);
  const binary = maskInt.toString(2).padStart(32, '0');
  if (!/^1*0*$/.test(binary)) {
    throw new Error('Invalid mask');
  }
  return binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
}

function prefixToMask(prefix) {
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return intToIp(maskInt);
}

function calculate() {
  const ipStr = document.getElementById('ip').value.trim();
  const maskStr = document.getElementById('mask').value.trim();
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ipStr)) {
    alert('Adresse IP invalide');
    return;
  }
  const octets = ipStr.split('.').map(o => parseInt(o, 10));
  if (octets.some(o => o < 0 || o > 255)) {
    alert('Adresse IP invalide');
    return;
  }
  let prefix;
  if (maskStr.includes('.')) {
    try {
      prefix = maskToPrefix(maskStr);
    } catch {
      alert('Masque décimal invalide');
      return;
    }
  } else {
    prefix = parseInt(maskStr, 10);
  }
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    alert('Préfixe/CIDR invalide');
    return;
  }
  const ipInt = ipToInt(ipStr);
  const maskDecimal = prefixToMask(prefix);
  const maskInt = ipToInt(maskDecimal);
  const networkInt = ipInt & maskInt;
  const broadcastInt = networkInt | (~maskInt >>> 0);
  const firstHostInt = prefix <= 30 ? networkInt + 1 : networkInt;
  const lastHostInt = prefix <= 30 ? broadcastInt - 1 : broadcastInt;
  const totalHosts = prefix <= 30 ? Math.pow(2, 32 - prefix) - 2 : prefix === 31 ? 0 : 1;
  const results = {
    'Adresse réseau': intToIp(networkInt),
    'Adresse broadcast': intToIp(broadcastInt),
    'Premier hôte': intToIp(firstHostInt),
    'Dernier hôte': intToIp(lastHostInt),
    'Nombre d’hôtes utilisables': totalHosts,
    'Masque décimal': maskDecimal,
    'CIDR (/ Préfixe)': prefix
  };
  const table = ['<table>'];
  table.push('<tr><th>Élément</th><th>Valeur</th></tr>');
  for (const [key, value] of Object.entries(results)) {
    table.push(`<tr><td>${key}</td><td>${value}</td></tr>`);
  }
  table.push('</table>');
  document.getElementById('results').innerHTML = table.join('');
}

document.getElementById('calculate').addEventListener('click', calculate);
