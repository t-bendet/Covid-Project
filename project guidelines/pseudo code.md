## fetching data

- [x] postmen :figure out how the data is structured
- [x] fetch countries
- [x] fetch covid
- [x] Q:CORS problems?

## filtering data

- [x] Q: what is the data i need?
- [x]A: data obj by world : {region(asia):{conterie(israel):{...relevent data}}}
- [x] Q: what is the most dynemic way to store and access it?
- [x] A:map,slower storing time,faster access , maintain entry order insertion.
- [x] Q: how chart j.s should gets the info?
- [x] A: arrays

## formating data for libaries

- [x] functions for getting data (africa,confirmed cases) (isreal,all parms.....)
- [x] divide to Regions total cases,new cases,total deaths,new deaths,total recovered,in critical condition,
- [x] conteries :Confirmed Cases,Number of Deaths,Number of recovered,Number of critical condition
- [x] injecting data into chart js

## create elements and display data

- [x] hard code html general structure
- [x] Q:what is created on the fly with j.s?

## css

- [ ] ohhhh shiny

## ninja

1. Add more features. You can do much more with this API
2. Make it look pretty
3. Tweak the performance. Maybe local storage can help us here
4. Create a spinner when the data is loading. or ither cool animation
5. Disable the buttons when you send an api request. Now what happens is you can click numerous of times on a button and it will send numerous times an api request. But we really only need one.
6. devision by sub regions
7. more forms of chrts
8. adiitional data on contry :contry api (borders,capital),covidapi(updated_at)
9. add favicon
