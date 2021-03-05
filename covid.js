async function getInitialData() {
  const covidPromise = await fetch("https://corona-api.com/countries");
  const covidData = await covidPromise.json(); //array of objects covidData.data[0]
  const countriesPromise = await fetch(
    "https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1"
  );

  const countriesData = await countriesPromise.json(); //array of objects countriesData[x]
  return [covidData.data, countriesData];
}
//
async function CreateDataObject() {
  // creating world
  const world = new Map([
    ["Asia", new Map([])],
    ["Europe", new Map([])],
    ["Africa", new Map([])],
    ["Americas", new Map([])],
    ["Oceania", new Map([])],
    ["Who Lives Here?", new Map([])],
  ]);
  const [covidArray, countriesArray] = await getInitialData();
  // if there is a name for the region place in proper region,if not put in "Who Lives Here?"
  for (const countrie of countriesArray) {
    let trimName = countrie.name.common.trim();
    if (countrie.region) {
      world.get(countrie.region).set(trimName, new Map([]));
      world.get(countrie.region).get(trimName).set("capitel", countrie.capital);
      world.get(countrie.region).get(trimName).set("region", countrie.region);
      world.get(countrie.region).get(trimName).set("borders", countrie.borders);
      world.get(countrie.region).get(trimName).set("TLD", countrie.tld[0]);
    } else {
      world.get("Who Lives Here?").set(trimName, new Map([]));
      world
        .get("Who Lives Here?")
        .get(trimName)
        .set("capitel", countrie.capital);
      world.get("Who Lives Here?").get(trimName).set("region", countrie.region);
      world
        .get("Who Lives Here?")
        .get(trimName)
        .set("borders", countrie.borders);
      world.get("Who Lives Here?").get(trimName).set("TLD", countrie.tld[0]);
    }
  }
  // looping over world regions and asaiging covid info to each country
  for (const info of covidArray) {
    for (const [region, countries] of world) {
      for (const [cont, val] of countries) {
        let conTLD = val.get("TLD");
        if (conTLD) {
          let parm = conTLD.slice(1).toUpperCase();
          if (info.code == parm) {
            val.set("info", info);
            // console.log(val)
          }
        }
      }
    }
  }
  // TODO  "Europe -Kosovo, United Kingdom","Americas -Bonaire"add contries
  return world;
}

async function mainData() {
  const worldMap = await CreateDataObject();
  console.log(worldMap.get("Asia"));
}
mainData();
