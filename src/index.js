import {fetchWeatherData, fetchImageByCityName} from './api.js'

const searchBox = document.querySelector('.search-box')
const input = document.querySelector('.search-box__search-input')
const infoBox = document.querySelector('.info-box')
const mainBox = document.querySelector('.main-box')
const infoText = document.querySelector('.info-box__info-text')
const daysBox = document.querySelector('.days-box')
const dayCards = document.querySelectorAll('.days-box__day-card')

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
    mainBox.querySelector('.main-box__weather-description').innerHTML = data.list[indexInDataList].weather[0].description
    mainBox.querySelector('.main-box__temp').innerHTML = `${data.list[indexInDataList].main.temp.toFixed(0)}<span>°C</span>`
    mainBox.querySelector('.main-box__date').innerHTML = 
    `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${date.toUTCString().match(/\s\d{2}:\d{2}/)}`
    mainBox.querySelector('.main-box__weather-icon').src = `${iconsURL}${data.list[indexInDataList].weather[0].icon}@2x.png`

    dayCards.forEach((currentDayCard) => {
        let currentDayCardData = data.list[currentDayCard.id]
        currentDayCard.querySelector('img').src = `${iconsURL}${currentDayCardData.weather[0].icon}.png`
        currentDayCard.querySelector('.days-box__week-day').innerHTML = weekDays[(new Date(currentDayCardData.dt * 1000)).getUTCDay()]
        currentDayCard.querySelector('.days-box__temp').innerHTML = `${currentDayCardData.main.temp.toFixed(0)}<span>°C</span>`
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

    infoBox.classList.add('info-box_active')
    infoBox.querySelector('.days-box__day-card_current')?.classList.remove('days-box__day-card_current')
    dayCards[0].classList.add('days-box__day-card_current')


    insertWeatherData(data)
}


searchBox.addEventListener('submit', searchHandler)


infoBox.addEventListener('transitionend', () => {
    infoText.classList.add('info-box__info-text_active')
    daysBox.classList.add('days-box_active')
    dayCards.forEach((dayCard)=>{
        dayCard.classList.add('days-box__day-card_active')
    })
    mainBox.classList.add('main-box_active')
})


dayCards.forEach((dayCards) => {
    dayCards.addEventListener('click', (e) => {
        infoBox.querySelector('.days-box__day-card_current').classList.remove('days-box__day-card_current')
        console.log(e.currentTarget)
        e.currentTarget.classList.add('days-box__day-card_current')
        insertWeatherData(data, e.currentTarget.id)
    })
})