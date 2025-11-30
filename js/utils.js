function randomStr() {
  return Math.random().toString(36).substring(2, 7);
}

function combineMatches(ids, names) {
  if (ids.length < 2) return;

  const availableCopy = [...ids];
  const matchesId = {};

  for (let i = 0; i < ids.length; i++) {
    const current = ids[i];
    const available = availableCopy.filter((n) => n !== current);
    if (available.length === 0) {
      return combineMatches(ids, names);
    }
    const randomId = Math.floor(Math.random() * available.length);
    const matchId = available[randomId];
    matchesId[current] = matchId;
    const indiceInCopia = availableCopy.indexOf(matchId);
    availableCopy.splice(indiceInCopia, 1);
  }

  const MATCHES = [];
  for (const [santaId, secretId] of Object.entries(matchesId)) {
    const user = {
      santa: { id: Number(santaId), name: names[santaId] },
      secret: { id: Number(secretId), name: names[secretId] },
    };
    MATCHES.push(user);
  }

  return MATCHES;
}

function crypt(array) {
  array = [randomStr(), ...array, randomStr()];
  const str = JSON.stringify(array);
  const base64 = btoa(str);
  return base64;
}

function decrypt(base64) {
  let data = null;
  try {
    let str = atob(base64);
    array = JSON.parse(str);
    array = array.slice(1, -1);
    data = array;
  } catch (error) {
    return { error: true };
  }
  return { data: data, error: false };
}

function isNumeric(str) {
  if (typeof str == "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function isArrayString(array) {
  if (!Array.isArray(array)) return;
  return !array.some((e) => typeof e != "string");
}

function isCorruptedData(data) {
  return !(
    data.length === 3 &&
    Array.isArray(data) &&
    isArrayString(data[0]) &&
    isNumeric(data[1]) &&
    isNumeric(data[2]) &&
    data[1] !== data[2] &&
    0 <= data[1] &&
    data[1] < data[0].length &&
    0 <= data[2] &&
    data[2] < data[0].length
  );
}

function genLink(obj) {}

function loadGame() {
  const key = window.location.href.split("?")[1];
  if (!key) return { error: true };
  const decrypted = decrypt(key);
  if (decrypted.error) return { error: true };
  if (isCorruptedData(decrypted.data)) return { error: true };

  const names = decrypted.data[0];
  const santaId = decrypted.data[1];
  const secretId = decrypted.data[2];

  const data = {
    names: names,
    santa: names[santaId],
    secret: names[secretId],
  };
  return { data: data, error: false };
}

function genMatches(names) {
  if (!Array.isArray(names)) return;
  const ids = names.map((_, i) => i);
  const matches = combineMatches(ids, names);
  matches.map((m, index) => {
    const array = [names, index, matches[index].secret.id];
    const secretKey = crypt(array);

    const http = "http://";
    const host = document.location.host;
    const lang = document.location.pathname || "/";
    const link = `${http}${host}${lang}r/?${secretKey}`;

    m.secretLink = link;
  });
  return matches;
}

let clipboardPopup;

async function setClipboard(text) {
  const type = "text/plain";
  const clipboardItemData = {
    [type]: text,
  };
  const clipboardItem = new ClipboardItem(clipboardItemData);
  await navigator.clipboard.write([clipboardItem]);

  document.querySelector("body").classList.add("is-copied");
  clearTimeout(clipboardPopup);
  clipboardPopup = setTimeout(() => {
    document.querySelector("body").classList.remove("is-copied");
  }, 1000);
}
