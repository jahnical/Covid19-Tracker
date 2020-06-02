
var countries = {}, summary = [], country = "", homeMenu, slug, global, loader;

function initialize() {
    document.getElementById("retry").style.display = "none";
    loader = document.getElementById("loading");
    loader.style.display = "block"; requestData("https://api.covid19api.com/summary", (result) => {
        if (result != 'Error') {
            summary = result.Countries;
            global = result.Global;
            summary.forEach((el) => {
              Object.assign(countries, {[el.Country.toUpperCase()]: el.Slug})
            })
            
            summary.sort((ele1, ele2) => {
                if (ele1.TotalConfirmed > ele2.TotalConfirmed) return -1;
                else if (ele1.TotalConfirmed < ele2.TotalConfirmed) return 1;
                else return 0;
            })

            switchTab('home');
            addHome();
            loader.style.display = "none";
            document.getElementById("retry").style.display = "none";
            addTop5();
        }
        
        else {
            document.getElementById("retry").style.display = "block";
            loader.style.display = "none";
        }
    });
}

function switchTab(tabName) {
    //Remove class active for current active button
    let actv = document.getElementsByClassName('active')[0];
    
    if (actv !== undefined) actv.classList.toggle('active');
    
    //add active class to selected tab button
    let btn = document.getElementsByClassName(tabName)[0];
    btn.classList += ' active';
    
    //set all tabs to display none
    let fc = document.getElementsByClassName ('focused')[0];
    if (fc != undefined) fc.classList.toggle('focused');
    
    let tab = document.getElementById(tabName);
    tab.classList.toggle('focused');
    
    changeTabContent();
}

function changeTabContent() {
    let tabId = document.getElementsByClassName('focused')[0].id;
    let tabTitle = document.getElementById('tabTitle');
    
    switch (tabId) {
        case "top5": tabTitle.innerHTML = "Highest Cases"; break;
        case "home": tabTitle.innerHTML = "Home <i class='fa fa-bars' onclick='viewMenu()'></i> <div id='homeMenu'><div onclick=display('searchBar')>Search Country</div><div onclick=display('map')>Select from Map</div><div onclick=display('global')>View Global</div></div>"; 
        homeMenu = document.getElementById("homeMenu")
         break;
        case "news": tabTitle.innerHTML  = "WHO News"; addNews(); break;
        case "advice": tabTitle.innerHTML = "WHO Advice"; addAdvice();
    }
}

function addTop5() {
   if (global != undefined) {
    let tab = document.getElementById("top5");
    let tables = "";
    for (let i = 0; i < 5; i++) {
        let data = summary[i];
        tables += `<table> <caption>${data.Country}</caption> ${getWorldTotalTable(data)}</table>`;
    }
    tab.innerHTML = tables;
    }
}
function addAdvice() {
    
}
function addNews() {
    
}
function addHome() {
     if (global != undefined) { 
             let table = `<caption>${country == ""? 'Global':country} Summary</caption>`;
             if (country != "") {
             
                 let localSum = summary.find((ele) => {return ele.Slug == slug;})
                 table = `<caption>${localSum.Country} Summary</caption>`;
                
                table += `<tr> <td> New Cases </td> <td> ${localSum.NewConfirmed} </td></tr>`;
                 table += `<tr> <td> Total Cases </td> <td> ${localSum.TotalConfirmed} </td></tr>`;
                 table += `<tr> <td> New Deaths </td> <td> ${localSum.NewDeaths} </td></tr>`;
                 table += `<tr> <td> Total Deaths </td> <td> ${localSum.TotalDeaths} </td></tr>`;
                 table += `<tr> <td> New Recovered </td> <td> ${localSum.NewRecovered} </td></tr>`;
                 table += `<tr> <td> Total Recovered </td> <td> ${localSum.TotalRecovered} </td></tr>`;
                 table += `<tr> <td> Total Active </td> <td> ${localSum.TotalConfirmed - localSum.TotalRecovered - localSum.TotalDeaths} </td></tr>`;
                 country = "";
             }
             
             else {
                 table += getWorldTotalTable(global);
             }
             
             document.getElementById('homeSummary').innerHTML = table;
       }      
}

function getWorldTotalTable(result) {
    let table = "";
    table += `<tr> <td> Total Cases </td> <td> ${result.TotalConfirmed} </td></tr>`;
    table += `<tr> <td> Total Deaths </td> <td> ${result.TotalDeaths} </td></tr>`;
    table += `<tr> <td> Total Recovered </td> <td> ${result.TotalRecovered} </td></tr>`;
    return table;
}

function requestData(url, callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    xhttp.send();
    let call = 0;
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callBack(JSON.parse(xhttp.responseText));
            call++;
            xhttp.close;
        }
        
        else if (xhttp.status > 400) {
            callBack("Error");
            call++;
            xhttp.close;
        }
    }
    setTimeout(() => {
        if (call === 0) {
            callBack("Error");
            xhttp.close;
        }
    }, 10000);
}

function searchCountry() {
    let inp = document.getElementById('countrySearch');
    if (inp.value != "") {
        slug = countries[inp.value.toUpperCase()];
        if (slug != undefined) {
            country = inp.value; addHome();
            inp.value = null;
            inp.parentNode.style.height = "0";
        }
        else {
            let sugg = summary.find((ele) => { return ele.Country.toUpperCase().includes(inp.value.toUpperCase())});
        
            alert(`Country not found!\n\n${sugg? ("Did you mean " + sugg.Country + "?") : ""}`);
        }
    }
}
function viewMenu() {
    homeMenu.style.display = "block"
    let doc = document.getElementById("main");
    doc.onclick = (event) => {
        if (homeMenu.style.display == "block") {
            homeMenu.style.display = "none";
            doc.onclick = null;
        }
    }
}

function display(eleId) {
    let element = document.getElementById(eleId);
    homeMenu.style.display = "none"
    if (eleId == "searchBar") {
        element.style.height = "50px";
    }
    else if (eleId == "global") {
        addHome();
    }
    else {
        alert("Coming Soon!")
    }
}

