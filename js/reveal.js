const santaReveal = document.querySelector(".secret-name");

let game = loadGame();

if (!game.error) {
  const { names, santa, secret } = game.data;
  [
    [".santa-name", santa],
    [".all-friend", names.slice(0, -1).join(", ")],
    [".last-friend", names.at(-1)],
    [".secret-name", secret],
  ].forEach((entry) => {
    const query = entry[0];
    const text = entry[1];
    document.querySelector(query).innerHTML = text;
  });

  santaReveal.addEventListener("click", () => {
    santaReveal.classList.remove("is-hide");
  });
} else {
}

document.addEventListener("load", () => {
  document.querySelector("body").classList.remove("is-loading");
  console.log("NON VA?");
});

window.addEventListener("load", () => {
  document.querySelector("body").classList.remove("is-loading");
});
