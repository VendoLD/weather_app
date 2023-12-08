const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast'
const weatherAPIKEY = '79803075acbe52ea992705dbd227c2a9'
const googleURL = 'https://customsearch.googleapis.com/customsearch/v1'
const CX = 'e1ca202a1b5ec48ca'
const googleAPIKey = 'AIzaSyAibgbOPAiKqLKmtJB44MDMoIklfpOfCJI'

export async function fetchWeatherData(cityName){
    const res = await fetch(weatherURL + `?q=${cityName}&appid=${weatherAPIKEY}&units=metric`)
    const data = res.json()
    return data
}

export async function fetchImageByCityName(cityName){
    const res = await fetch(googleURL + `?q=${cityName}&cx=${CX}&key=${googleAPIKey}&searchType=image&fileType=jpg&num=1`)
    return res.json()
}

