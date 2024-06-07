const locationEL = document.getElementById('location');
const dateEl = document.getElementById('date');
const timeEl = document.getElementById('time');
const ampmEl = document.getElementById('am-pm');
const currentTempEl = document.getElementById('current-temp');
const windSpeedEl = document.getElementById('wind-speed');
const windDirectionEl = document.getElementById('wind-direction');
const currentConditionEl = document.getElementById('current-condition');
const dayTimeEl = document.getElementById('day-time');
const dayImageEl = document.getElementById('day-image');
const dayTempEl = document.getElementById('day-temp');
const weakImageEl = document.getElementById('weak-image');
const weakDateEl = document.getElementById('weak-date');
const weakConditionEl = document.getElementById('weak-condition');
const minEl = document.getElementById('min');
const maxEl = document.getElementById('max');
const dayEl = document.querySelector('.day-forecast');
const weakEl = document.querySelector('.weak-forecast');

const API_KEY = 'ba606f453cfc428580c62323240306';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hours = time.getHours();
    const hour = hours < 1 ? 12 : hours;
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes);
    ampmEl.innerHTML = ampm;

    dateEl.innerHTML = days[day] + ' ' + date + ', ' + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        console.log(latitude, longitude);

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7&hourly=1`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    const location = data.location.name;
    const currentTemp = data.current.temp_c;
    const windSpeed = data.current.wind_kph.toFixed(2);
    const windDirection = data.current.wind_dir;
    const condition = formatCondition(data.current.condition.text);
    const is_day = data.current.is_day;

    function formatCondition(condition) {
        let condition_ = condition.toLowerCase();
        if (condition_.includes('rain')) {
            return 'Rain';
        } else if (condition_.includes('cloud')) {
            return 'Cloud';
        } else if (condition_.includes('sunny') || condition_.includes('clear')) {
            return 'Sunny';
        } else if (condition_.includes('snow')) {
            return 'Snow';
        } else {
            return 'Cloud';
        }
    }
    

    locationEL.innerHTML = location;
    currentTempEl.innerHTML = currentTemp + '°C';
    windSpeedEl.innerHTML = windSpeed/10;
    windDirectionEl.innerHTML = windDirection;
    currentConditionEl.innerHTML = condition;

    function formatTime(time) {
        const timeObj = new Date(time);
        const hours = timeObj.getHours();
        const hour = hours < 1 ? 12 : hours;
        const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
        const minutes = timeObj.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    }

    function formatDay(day) {
        const date = new Date(day);
        const day_ = days[date.getDay()];
        return day_;
    }
    

    data.forecast.forecastday.forEach((day, idx) => {
        if (idx == 0) {
            day.hour.forEach((hour, idx) => {
                // Create elements for each hour
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('day-forecast-item');
            
                const timeEl = document.createElement('div');
                timeEl.classList.add('day-forecast-item-time');
                timeEl.textContent = formatTime(hour.time);
            
                const imageEl = document.createElement('img');
                imageEl.src = hour.condition.icon;
                imageEl.alt = 'weather icon';
                imageEl.classList.add('w-icon');
            
                const tempEl = document.createElement('div');
                tempEl.classList.add('day-forecast-item-temp');
                tempEl.innerHTML = `${hour.temp_c}&#176;C`; // Replace with actual temperature data if available
            
                // Append elements to forecast item
                forecastItem.appendChild(timeEl);
                forecastItem.appendChild(imageEl);
                forecastItem.appendChild(tempEl);
            
                // Append forecast item to dayEl
                dayEl.appendChild(forecastItem);
            });
        } else {
            const weakItem = document.createElement('div');
            weakItem.classList.add('weak-forecast-item');

            const imageEl = document.createElement('img');
            imageEl.src = day.day.condition.icon;
            imageEl.alt = 'weather icon';
            imageEl.classList.add('w-icon');

            const dayItem = document.createElement('div');
            dayItem.classList.add('weak-forecast-day');

            const dateEl = document.createElement('div');
            dateEl.classList.add('weak-forecast-day-date');
            dateEl.textContent = formatDay(day.date);

            const conditionEl = document.createElement('div');
            conditionEl.classList.add('weak-forecast-day-condition');
            conditionEl.textContent = day.day.condition.text;

            dayItem.appendChild(dateEl);
            dayItem.appendChild(conditionEl);

            const tempItem = document.createElement('div');
            tempItem.classList.add('weak-forecast-min-max-temp');

            const minEl = document.createElement('div');
            minEl.classList.add('temp');
            minEl.innerHTML = `${day.day.mintemp_c}&#176;C`;

            const maxEl = document.createElement('div');
            maxEl.classList.add('temp');
            maxEl.innerHTML = `${day.day.maxtemp_c}&#176;C`;

            tempItem.appendChild(minEl);
            tempItem.appendChild(maxEl);

            weakItem.appendChild(imageEl);
            weakItem.appendChild(dayItem);
            weakItem.appendChild(tempItem);

            weakEl.appendChild(weakItem);

        }
    });
}