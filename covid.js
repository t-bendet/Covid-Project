async function getInitialData() {
  const covidPromise = await fetch("https://corona-api.com/countries");
  const covidData = await covidPromise.json(); //array of objects covidData.data[0]
  const countriesPromise = await fetch(
    "https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1"
  );
  const countriesData = await countriesPromise.json(); //array of objects countriesData[x]
  return [covidData.data, countriesData];
}
//TODO add callbacks as parms
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
  // looping over world regions and assigning covid info to each country via tld/code
  for (const info of covidArray) {
    for (const [region, countries] of world) {
      for (const [cont, val] of countries) {
        let conTLD = val.get("TLD");
        if (conTLD) {
          let parm = conTLD.slice(1).toUpperCase();
          if (info.code == parm) {
            val.set("info", info);
          } else if (info.code == "GB") {
            world.get("Europe").get("United Kingdom").set("info", info);
          } else if (info.code == "BQ") {
            world.get("Americas").get("Bonaire").set("info", info);
          }
        }
      }
    }
  }
  // last contry that dose not have info
  world.get("Europe").delete("Kosovo"); //TODO make more dynamic
  // for (const [region, countries] of world) {
  //   for (const [cont, val] of countries) {
  //     if (!val.has("info")) {
  //       console.log(val);
  //     }
  //   }
  // }
  return world;
}

async function mainDataFunctions() {
  const worldMap = await CreateDataObject();
  function regionsData(region, data) {
    const arrayContries = [];
    const arrayCases = [];
    if (region == "World") {
      for (const [reg, con] of worldMap) {
        for (const [key, val] of worldMap.get(reg)) {
          arrayContries.push(key);
          arrayCases.push(val.get("info").latest_data[data]);
        }
      }
    } else {
      for (const [key, val] of worldMap.get(region)) {
        arrayContries.push(key);
        arrayCases.push(val.get("info").latest_data[data]);
      }
    }
    return [arrayContries, arrayCases, data];
  }
  function contriesData(region, contry) {
    const data = worldMap.get(region).get(contry).get("info");
    const data2 = {
      confirmed: data.latest_data.confirmed,
      critical: data.latest_data.critical,
      deaths: data.latest_data.deaths,
      recovered: data.latest_data.recovered,
      deaths_today: data.today.deaths,
      confirmed_today: data.today.confirmed,
    };
    return data2;
  }
  return [regionsData, contriesData];
}
async function initCharts() {
  const [regionsChart, countriesChart] = await mainDataFunctions();
  const [conLabel, covidLabel, nameLabel] = await regionsChart(
    "World",
    "confirmed"
  );
  const x = await countriesChart("Asia", "Israel");
  console.log(x);
  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: conLabel,
      datasets: [
        {
          label: nameLabel,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: covidLabel,
        },
      ],
    },
    options: {},
  });
}
initCharts();
