const userTab=document.querySelector('[data-userWeather]');
const searchTab=document.querySelector('[data-searchWeather]');
const userContainer=document.querySelector('.weatherContainer')
const grantAccessContainer=document.querySelector('.grant-locationContainer');
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container');
const errorCont=document.querySelector('.errorContainer');
const errorMessage=document.querySelector('[error-data]');

const API_KEY="f0f89d63f654681cb198536a90d1d9e2";
let curr_tab=userTab;
curr_tab.classList.add("current_tab");
getfromSessionStorage();

function switchTab(clickTab){
    if(clickTab!=curr_tab)
    {
        curr_tab.classList.remove('current_tab');
        curr_tab=clickTab;
        curr_tab.classList.add("current_tab");

        if(!searchForm.classList.contains('active')){
            errorCont.classList.remove('active');
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            loadingScreen.classList.remove('active');
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
        }
    }


function getfromSessionStorage(){
    const localCordinates=sessionStorage.getItem('user-coordinate');

    if(!localCordinates)
    {
        errorCont.classList.remove('active');
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,long}=coordinates;
    grantAccessContainer.classList.remove('active');
    errorCont.classList.remove('active');
    loadingScreen.classList.add('active');

    try{

        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);
        const data=await response.json();
        console.log(data);
        
        loadingScreen.classList.remove('active');
        console.log("fetched");
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
         loadingScreen.classList.remove('active');
         errorMessage.textContent=err;
         console.log(errorMessage);
         console.log(errorCont);
         errorCont.classList.add('active');
    }
}

function renderWeatherInfo(data)
{
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const desc=document.querySelector('[data-weatherDesc]');
    const temperature=document.querySelector('[data-temperature]');
    const windSpeed=document.querySelector('[data-windSpeed]');
    const humidity=document.querySelector('[data-humididty]');
    const clouds=document.querySelector('[data-cloudiness]');

    cityName.textContent=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent=data?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.textContent=`${data?.main?.temp}°C`;
    windSpeed.textContent=`${data?.wind?.speed}m/s`;
    humidity.textContent=`${data?.main?.humidity}%`;
    clouds.textContent=`${data?.clouds?.all}%`;

}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        long:position.coords.longitude
    }
    sessionStorage.setItem('user-coordinate',JSON.stringify(userCoordinates));
    console.log(userCoordinates);
    fetchUserWeatherInfo(userCoordinates);
}
function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        /*errorMessage.textContent="geolocation is not supported in your browser"
        errorCont.classList.add('active');*/
    }
}
const grantBtn=document.querySelector('[data-grantAccess]')
grantBtn.addEventListener('click',getLocation);

const searchInput=document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName=="")
    {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName){
    errorCont.classList.remove('active');
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data=await response.json();
        console.log(data);
        if (data?.cod === "404") {
               throw new Error(data?.cod);
          }          
        loadingScreen.classList.remove('active');
        console.log("fetched");
        console.log(userInfoContainer);
        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
        errorMessage.textContent=err;
        console.log(errorMessage);
        console.log(errorCont);
        errorCont.classList.add('active');
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});






