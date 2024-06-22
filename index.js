
// const API_KEY="";

// async function showweather()
// {
//     // let city="goa";
//     const response= await fetch('https://api.openweathermap.org/data/2.5/weather?q=haryana&APPID=e360d35e26768f01f598ceddfa56ee7f');
//     const data=await response.json();
//     let newpara=document.createElement('p');
//     newpara.textContent=`${data?.main?.temp.toFixed(2)}°C`;
//     document.body.appendChild(newpara);
// }
// showweather();

const usertab=document.querySelector("p[data-userweather]");
const searchtab=document.querySelector("p[data-searchweather]");
const usercontainer=document.querySelector(".weather-container");
const grantcontainer=document.querySelector(".grant-location");
const searchform=document.querySelector("form[data-searchform]");
const loadingscreen=document.querySelector(".loading");
const userinfocontainer=document.querySelector(".weather-info-container");

let currenttab=usertab;
const API_KEY="e360d35e26768f01f598ceddfa56ee7f";
currenttab.classList.add("current-tab");


//function for switching tab
function switchtab(clickedtab)
{
    if(clickedtab!=currenttab)
    {
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");
        //searchform is invisible so i want to make it visible
        if(!searchform.classList.contains("active"))
        {
            userinfocontainer.classList.remove("active");
            grantcontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            //jo bi search kia h weather use bi remove krn a hoga  so removing userinfo container
            userinfocontainer.classList.remove("active");
            //your weather matalab default weather ko render krna h
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click",()=>{
    switchtab(usertab)
});

searchtab.addEventListener("click",()=>{
    switchtab(searchtab)
});

function getfromsessionstorage()
{
    const localcordinates=sessionStorage.getItem("user-cordinate");
    if(!localcordinates)
    {
        grantcontainer.classList.add("active");
    }
    else{
        const cordinates = JSON.parse(localcordinates);
        fetchuserweatherinfo(cordinates);
    }
}


async function fetchuserweatherinfo(cordinates)
{
    const{lat,lon}=cordinates;
    grantcontainer.classList.remove("active");
    loadingscreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err)  
    {
        loadingscreen.classList.remove("active");
        console.log(" 1st error"); 
    }
}

function renderweatherinfo(weatherinfo)
{
    const cityname=document.querySelector("p[data-cityname]");
    const countryicon=document.querySelector("img[data-country]");
    const desc=document.querySelector("p[data-weatherdescription]");
    const weathericon=document.querySelector("img[data-weathericon]");
    const temperature=document.querySelector("p[data-temperature]");
    const windspeed=document.querySelector("p[data-windspeed]");
    const humidity=document.querySelector("p[data-humidity]");
    const cloudiness=document.querySelector("p[data-cloud]");
    cityname.innerText=weatherinfo?.name;   
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src=`https://openweathermap.org/img/wn/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=weatherinfo?.main?.temp;
    windspeed.innerText=weatherinfo?.wind?.speed;
    humidity.innerText=weatherinfo?.main?.humidity;
    cloudiness.innerText=weatherinfo?.clouds?.all;
}
function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        console.log("no geolocation support");
    }
}

function showposition(position)
{
    const usercordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinate",JSON.stringify(usercordinates));
    fetchuserweatherinfo(usercordinates);
}


const grantaccessbutton=document.querySelector("button[data-grantaccess]");
grantaccessbutton.addEventListener("click",getLocation);

const searchinput=document.querySelector("input[data-searchinput]");
searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;
    if(cityname==="")
    {
        return;
    }
    else{
        fetchsearchweatherinfo(cityname);
    }
})

async function fetchsearchweatherinfo(city)
{
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantcontainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err)
    {
        console.log("error");
    }
}