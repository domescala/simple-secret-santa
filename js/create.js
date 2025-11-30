let MATCHES = [];
let NAMES = [];

function createGame() {
  const LINKS = document.querySelectorAll(".secret-link");

  const names = [...document.querySelectorAll(".santa-input")]
    .map((i) => i.value)
    .filter((e) => e != "");

  MATCHES = genMatches(names);
  console.log(MATCHES);
  MATCHES.forEach((m, i) => {
    const name = m.santa.name;
    const secretLink = m.secretLink;
    const LINK = LINKS[i];
    console.log(name, "->", m.secret.name);
    LINK.innerHTML = "link for " + m.santa.name;
    LINK.setAttribute("href", secretLink);

    LINK.addEventListener("click", (e) => {
      e.preventDefault();
      setClipboard(secretLink);
    });

    document.querySelector("#input-list").style.display = "none";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const INPUT_CONTAINER = document.querySelector("#input-list");
  const LINK_CONTAINER = document.querySelector("#link-list");
  const inputHTML = document.querySelector(".santa-input").outerHTML;
  const linkHTML = document.querySelector(".secret-link").outerHTML;

  INPUT_CONTAINER.innerHTML += inputHTML.repeat(99);
  LINK_CONTAINER.innerHTML += linkHTML.repeat(99);
});
