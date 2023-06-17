if (
  document.location.href.search("flight.easemytrip.com") &&
  document.location.href.search("Review") &&
  document.location.href.search("Checkout")
) {
  let orgs = document.querySelectorAll("[ng-bind=\"l.org.split('|')[0]\"]");
  orgs = orgs.slice(0, Math.ceil(orgs.length / 2));
  let dests = document.querySelectorAll("[ng-bind=\"l.dest.split('|')[0]\"]");
  dests = dests.slice(0, Math.ceil(orgs.length / 2));

  alert(orgs[0].outerText);
}
