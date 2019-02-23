const UpdateCount= function (toadd) {
  let countryNumbers= document.getElementsByClassName("js-amount")[0];
  countryNumbers.innerText= toadd;
};
const  localKey='Travel-planner';
const hasItem=(key)=>{
        return getAllItems().includes(key);

};
const addItem=(key)=>{
    let array=getAllItems();
    array.push(key);
    localStorage.setItem(localKey,JSON.stringify(array))
    countItem();
};
const getAllItems=()=>{
    return JSON.parse(localStorage.getItem(localKey))||[];
};
const removeItem=(key)=>{
    let array=getAllItems();
    let filtered = array.filter(function(value, index, arr){

        return value != key;

    });
    localStorage.setItem(localKey,JSON.stringify(filtered));
    countItem();
};
const countItem=()=>{
    let array=getAllItems();
    UpdateCount(array.length);
};
const fadeAndRemoveNotifications= notification=>{
    notification.classList.add("u-fade-out");
    setTimeout(()=>{
        notification.remove();
    },800);
}
const showNotification= (element)=>{
    let alertbar= document.getElementsByClassName("js-alertbar")[0];
    let item= document.createElement("div");
    item.classList.add("c-Message");
    item.innerHTML=` 
 <h2 class="c-Message__header">You have selected ${element.dataset.countryName}</h2>
 <button class="c-Message__action js-undo">Undo</button>`
    alertbar.append(item);


        item.getElementsByClassName("js-undo")[0].addEventListener("click", function () {
       removeItem(element.getAttribute("for"));
       let checkbox= document.getElementById(element.getAttribute("for"));
       checkbox.checked=0;
       fadeAndRemoveNotifications(item);
    });
    let timeout=setTimeout(()=>{
    fadeAndRemoveNotifications(item);
    },1500);
    item.addEventListener("mouseenter",function () {
        clearTimeout(timeout);
    });
    item.addEventListener("mouseleave",function () {
        timeout=setTimeout(()=>{
            fadeAndRemoveNotifications(item);
        },1500);
    });
};
const addListenersToCountries=function (classselector) {
  const countries= document.querySelectorAll(classselector);
  for(let country of countries){
      country.addEventListener("click",function () {
            let key= this.getAttribute("for");
            if (hasItem(key))
                removeItem(key);
            else {
                addItem(key);
                showNotification(country);
            }});
      }
  };
async function getMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
};
const showCountries =async data => {
    let index=1;
    let grid = document.getElementsByClassName("js-country-holder")[0];
    grid.innerHTML = "";
    for (let country of data) {
        let countryname = country.name;
        let countryshort = country.cioc+"-"+country.alpha2Code;
        let nativelan = country.nativeName;
        let countryimage = country.flag;
        let article = document.createElement("article");
        article.classList.add("c-countryContainer");
        article.innerHTML = " <input id=\"" + countryshort + "\" type=\"checkbox\""+ (hasItem(countryshort)?'checked=checked':'') +" class=\"o-hide c-country__input js-checkbox\" />\n" +
            "                <label data-country-name='"+countryname+"' for=\"" + countryshort + "\" class=\"c-country js-country\">\n" +
            "                    <div class=\"c-country-header\">\n" +
            "                        <h2 class=\"c-country-header__name\">" + countryname + "</h2>\n" +
            "                        <div class=\"c-country-header__flag js-flag\" style='width: 25px; height: 18.75px;'></div>\n" +
            "                    </div>\n" +
            "                    <p class=\"c-country__native-name\">" + nativelan + "</p>\n" +
            "                </label>";

        grid.append(article);

        let item =article.getElementsByClassName("js-flag")[0];

         let h=item.clientWidth;
         let w = item.clientHeight;
        for(var i = 0; i < h; i++){
            var flagElement = document.createElement("div");
            flagElement.classList.add("flag-element");
            flagElement.style.animationDelay =-index+i*10 + 'ms';
            flagElement.style.background="url('"+countryimage+"')";
            flagElement.style.backgroundPosition=-i+"px 0px";
            flagElement.style.backgroundSize= "25px 18.75px";
            item.append(flagElement);
            w++;

        }


index+=33.33333333333333333333333;
    };

    addListenersToCountries('.js-country');


};
const fetchCountries = region => {
    fetch("https://restcountries.eu/rest/v2/region/" + region).then(respone => {
        return respone.json();
    }).then(json => {

        showCountries(json);
    }).catch(err => {
        console.log("Er is een fout opgetreden ==> " + err);
    });
};

const enableListeners = () => {
// 1: get zi buttons
    let regionButtons = document.getElementsByClassName("js-region-select");
// 2: listen to zi buttons
    for (let button of regionButtons) {
        button.addEventListener("click", function () {
            const region = this.getAttribute("data-region");

            fetchCountries(region);
        });
        fetchCountries("europe");
    }

// 3: look up zi data property
// 4: get zi data from zi api
};

const init = () => {
    console.log("GODDAMN IT NAPPA!!!!!!");
    countItem();
    enableListeners();
};

document.addEventListener("DOMContentLoaded", ()=>{

    init();});