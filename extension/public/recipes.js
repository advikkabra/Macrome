if (document.location.href.search("allrecipes.com/recipe")) {
  let sodium = document
    .evaluate(
      '//*[@id="recipe__nutrition-facts_1-0"]/div[2]/div/div/table/tbody/tr[5]/td[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    .singleNodeValue.lastChild.textContent.match(/\d+/g)
    .map(Number)[0];
  console.log(sodium);
  let calories = document
    .evaluate(
      '//*[@id="recipe__nutrition-facts_1-0"]/div[1]/table/tbody/tr[1]/td[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    .singleNodeValue.lastChild.textContent.match(/\d+/g)
    .map(Number)[0];
  let fat = document
    .evaluate(
      '//*[@id="recipe__nutrition-facts_1-0"]/div[1]/table/tbody/tr[2]/td[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    .singleNodeValue.lastChild.textContent.match(/\d+/g)
    .map(Number)[0];
  let carbs = document
    .evaluate(
      '//*[@id="recipe__nutrition-facts_1-0"]/div[1]/table/tbody/tr[3]/td[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    .singleNodeValue.lastChild.textContent.match(/\d+/g)
    .map(Number)[0];
  let protein = document
    .evaluate(
      '//*[@id="recipe__nutrition-facts_1-0"]/div[1]/table/tbody/tr[4]/td[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    .singleNodeValue.lastChild.textContent.match(/\d+/g)
    .map(Number)[0];
  let title = document.title;
  let payload = {
    name: title,
    calories: calories,
    protein: protein,
    carbs: carbs,
    fat: fat,
    sodium: sodium,
  };
  chrome.storage.local.set({ recipe: payload }, () => {});
}
