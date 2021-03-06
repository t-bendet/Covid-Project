async function getInitialData() {
  const covidPromise = await fetch("https://corona-api.com/countries");
  const covidData = await covidPromise.json(); //array of objects covidData.data[0]
  const countriesPromise = await fetch(
    "https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1"
  );
  const countriesData = await countriesPromise.json(); //array of objects countriesData[x]
  return [covidData.data, countriesData];
}
const $ = (x) => document.querySelector(x);
const body = $("body");

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
  //
  for (const [region, countries] of world) {
    for (const [cont, val] of countries) {
      if (!val.has("info")) {
        world.get(region).delete(cont);
      }
    }
  }
  return world;
}

async function regionsDataFunction() {
  const worldMap = await CreateDataObject();
  function regionsData(funRegion, funData) {
    const arrayContries = [];
    const arrayCases = [];
    if (funRegion == "World") {
      for (const [reg, con] of worldMap) {
        for (const [key, val] of worldMap.get(reg)) {
          arrayContries.push(key);
          arrayCases.push(val.get("info").latest_data[funData]);
        }
      }
    } else {
      for (const [key, val] of worldMap.get(funRegion)) {
        arrayContries.push(key);
        arrayCases.push(val.get("info").latest_data[funData]);
      }
    }
    return [arrayContries, arrayCases, funData];
  }
  return regionsData;
}
async function contriesDataFunction() {
  const worldMap = await CreateDataObject();
  let regi;
  function contriesData(contry) {
    for (const [key, val] of worldMap) {
      if (val.has(contry)) {
        regi = key;
      }
    }
    const data = worldMap.get(regi).get(contry).get("info");
    const data2 = {
      confirmed: data.latest_data.confirmed,
      critical: data.latest_data.critical,
      deaths: data.latest_data.deaths,
      recovered: data.latest_data.recovered,
      deaths_today: data.today.deaths,
      confirmed_today: data.today.confirmed,
      population: data.population,
    };
    return data2;
  }
  return contriesData;
}
//
const infoContainer = $(".info-container");

async function initChart(chartReg, chartData) {
  let regionsChart = await regionsDataFunction();
  let [conLabel, covidLabel, nameLabel] = await regionsChart(
    chartReg,
    chartData
  );
  infoContainer.innerHTML = "";
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "myChart");
  infoContainer.appendChild(canvas);
  let ctx = document.getElementById("myChart").getContext("2d");
  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: conLabel,
      datasets: [
        {
          label: nameLabel,
          backgroundColor: "rgb(231, 197, 0)",
          borderColor: "rgb(80, 55, 65",
          fontcolor: "red",
          data: covidLabel,
        },
      ],
    },
    options: {},
  });
  Chart.defaults.global.defaultFontColor = "#fff";
  countryBtns.innerHTML = "";
  for (let conBtn of conLabel) {
    let btn = document.createElement("button");
    btn.innerText = conBtn;
    countryBtns.appendChild(btn);
  }
}

async function initboxes(e) {
  let contrey = e.target.innerText;
  let contryBoxes = await contriesDataFunction();
  let info = await contryBoxes(contrey);
  infoContainer.innerHTML = "";
  for (let [key, value] of Object.entries(info)) {
    let box = document.createElement("div");
    box.classList.add("box");
    let h5 = document.createElement("h5");
    h5.innerText = key;
    box.appendChild(h5);
    let p = document.createElement("p");
    p.innerText = value;
    box.appendChild(p);
    infoContainer.appendChild(box);
  }
}
const chartTemp = {
  data: "confirmed",
  reg: "Asia",
};

//
const regionBtns = $(".region-btns");
//
regionBtns.addEventListener("click", async (e) => {
  let eventReg = e.target.innerText;
  chartTemp.reg = eventReg;
  let eventData = chartTemp.data;
  initChart(eventReg, eventData);
});
//
const CaseBtns = $(".case-btns");
//
CaseBtns.addEventListener("click", async (e) => {
  let eventData2 = e.target.innerText;
  chartTemp.data = eventData2;
  let eventReg2 = chartTemp.reg;
  initChart(eventReg2, eventData2);
});

const countryBtns = $(".country-btns");
countryBtns.addEventListener("click", initboxes);
