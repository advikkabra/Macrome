if (
  document.location.href.search("flight.easemytrip.com") &&
  document.location.href.search("Review") &&
  document.location.href.search("Checkout")
) {
  console.log("hello");
  let orgs = document.querySelectorAll("[ng-bind=\"l.org.split('|')[0]\"]");
  let dests = document.querySelectorAll("[ng-bind=\"l.dest.split('|')[0]\"]");

  if (orgs && dests) {
    let payload = { routes: [] };
    for (let i = 0; i < orgs.length / 2; i++) {
      //console.log(orgs[i].outerText, "-->", dests[i].outerText);
      payload.routes.push({
        from: orgs[i].outerText,
        to: dests[i].outerText,
        passengers: 1,
      });
    }
    const checkout = document.getElementById("spnVerifyEmail");
    checkout.addEventListener("click", (_) => {
      chrome.storage.local.get(["email"], (value) => {
        let mail = value.email;

        for (let i = 0; i < payload.routes.length; i++) {
          payload["routes"][i]["email"] = mail;
        }

        fetch("http://localhost:5000/api/flights", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      });
    });
  }
}
