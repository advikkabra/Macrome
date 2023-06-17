if (document.location.href.search("amazon.in") !== -1) {
  const addToCart = document.getElementById("freshAddToCartButton");

  if (addToCart) {
    console.log("hi");
    addToCart.addEventListener("click", (_) => {
      const category = document.querySelector(
        "[selected='selected']"
      ).outerText;
      const title = document.getElementById("productTitle").innerText;
      if (category === "fresh") {
        console.log(category, title);
        let words = title.split(" ");
        let remainingWords = words.slice(1);
        let result = remainingWords.join(" ");
        let existing = JSON.parse(sessionStorage.getItem("Macrome"));
        if (existing == null) existing = [];
        existing.push({ title: result });
        console.log(existing);
        sessionStorage.setItem("Macrome", JSON.stringify(existing));
      }
    });
  }

  const h = document.getElementsByTagName("h1")[0];

  if (document.location.href.search("amazon.in/cart/localmarket") !== -1) {
    let titleElements = document.getElementsByClassName("sc-product-title");
    let titles = [];
    let payload = { items: [] };

    for (let i = 0; i < titleElements.length; i++) {
      let title =
        titleElements[i].firstElementChild.firstElementChild.textContent;
      title = title.split(" ").slice(1).join(" ");
      titles.push(title);
      payload["items"].push({ ingr: title });
    }

    console.log(titles);

    fetch("http://localhost:5000/api/estimate", {
      method: "POST",
      body: JSON.stringify({ ingr: titles }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        const check = document.getElementById(
          "sc-alm-buy-box-ptc-button-ctnow-announce"
        );
        console.log(res["calories"]);
        check.outerText = `Checkout - Calories: ${Math.floor(res["calories"])}`;

        chrome.storage.local.set(
          { calories: Math.floor(res["calories"]) },
          () => {
            console.log("done");
          }
        );
      });

    const checkout = document.querySelector(
      '[data-feature-id="proceed-to-checkout-action"]'
    );

    checkout.addEventListener("click", (_) => {
      chrome.storage.local.get(["email"], (value) => {
        const mail = value.email;
        for (let i = 0; i < payload["items"].length; i++) {
          payload["items"][i]["email"] = mail;
          fetch("http://localhost:5000/api/macros", {
            method: "POST",
            body: JSON.stringify(payload["items"][i]),
            headers: { "Content-Type": "application/json" },
          });
        }
        chrome.storage.local.remove(["calories"]);
      });
    });
  }
}
