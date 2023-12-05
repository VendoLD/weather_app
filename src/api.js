const URL = 'https://api.openweathermap.org/data/2.5/forecast'
const APIKEY = '79803075acbe52ea992705dbd227c2a9'

export async function fetchWeatherData(cityName){
    const res = await fetch(URL + `?q=${cityName}&appid=${APIKEY}&units=metric`)
    const data = res.json()
    return data
}