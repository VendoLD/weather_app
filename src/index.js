import {fetchWeatherData, fetchImageByCityName} from './api.js'

const searchBox = document.querySelector('.search-box')
const input = document.querySelector('.search-input')
const infoBox = document.querySelector('.info-box')
const mainBox = document.querySelector('.main-box')
const infoText = document.querySelector('.info-text')
const daysBox = document.querySelector('.days-box')
const dayCards = document.querySelectorAll('.day-card')

const iconsURL = 'https://openweathermap.org/img/wn/'
const months = [
'January', 
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
]

const weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]

let data = {}



function insertWeatherData(data, indexInDataList = 0){
    const date = new Date(data.list[indexInDataList].dt * 1000 + data.city.timezone * 1000)

    infoBox.querySelector('.precipitation-value').innerHTML = `${(data.list[indexInDataList].pop * 100).toFixed(0)} %`
    infoBox.querySelector('.humidity-value').innerHTML = `${data.list[indexInDataList].main.humidity} %`
    infoBox.querySelector('.wind-speed-value').innerHTML = `${data.list[indexInDataList].wind.speed} m/s`

    mainBox.style.backgroundImage = `url(${data.cityImgLink})`
    mainBox.querySelector('.main-box__location').innerHTML = data.city.name
    mainBox.querySelector('.main-box__bottom__weather-description').innerHTML = data.list[indexInDataList].weather[0].description
    mainBox.querySelector('.main-box__bottom__temp').innerHTML = `${data.list[indexInDataList].main.temp.toFixed(0)}<span>°C</span>`
    mainBox.querySelector('.main-box__top__date').innerHTML = 
    `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${date.toUTCString().match(/\s\d{2}:\d{2}/)}`
    mainBox.querySelector('.main-box__bottom__weather-icon').src = `${iconsURL}${data.list[indexInDataList].weather[0].icon}@2x.png`

    dayCards.forEach((currentDayCard) => {
        let currentDayCardData = data.list[currentDayCard.id]
        currentDayCard.querySelector('img').src = `${iconsURL}${currentDayCardData.weather[0].icon}.png`
        currentDayCard.querySelector('.week-day').innerHTML = weekDays[(new Date(currentDayCardData.dt * 1000)).getUTCDay()]
        currentDayCard.querySelector('.day-card__temp').innerHTML = `${currentDayCardData.main.temp.toFixed(0)}<span>°C</span>`
    })

}


async function searchHandler(e){
    e.preventDefault()
    try{
        console.log(input.value)
        data = await fetchWeatherData(input.value)
        const cityImgData = await fetchImageByCityName(input.value)
        data.cityImgLink = cityImgData.items[0].link
        
    }catch(err){
        alert(`Error ${err.message}`)
    }
    if (data.cod != '200'){
        alert('This city does not exist')
        return
    }

    data.list = data.list.filter((timeStamp) => {
        const timeStampDate = new Date(timeStamp.dt * 1000)
        return ((timeStampDate.getUTCHours() == 12 && timeStampDate.getUTCDate() != (new Date(data.list[0].dt ** 1000)).getUTCDate()) || timeStamp == data.list[0])
    })

    infoBox.classList.add('info-box-active')
    infoBox.querySelector('.current-day-card').classList.remove('current-day-card')
    dayCards[0].classList.add('current-day-card')


    insertWeatherData(data)
}


searchBox.addEventListener('submit', searchHandler)

// input.addEventListener('keydown', (e)=>{
//     if(e.key == 'Enter'){
//         searchHandler()
//     }
// })


infoBox.addEventListener('transitionend', () => {
    infoText.classList.add('info-text-active')
    daysBox.classList.add('days-box-active')
    dayCards.forEach((dayCard)=>{
        dayCard.classList.add('day-card-active')
    })
    mainBox.classList.add('main-box-active')
})


dayCards.forEach((dayCards) => {
    dayCards.addEventListener('click', (e) => {
        infoBox.querySelector('.current-day-card').classList.remove('current-day-card')
        console.log(e.currentTarget)
        e.currentTarget.classList.add('current-day-card')
        insertWeatherData(data, e.currentTarget.id)
    })
})