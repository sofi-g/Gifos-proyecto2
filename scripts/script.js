//constantes 
const APIurl = "https://api.giphy.com/v1/gifs/";
const APIkey = "l9bQPMQyB7YdGuYipb4xzaTryYkF2TRX";

let sailor_day = "/style/sailor_day.css";
let sailor_night = "/style/sailor_night.css";

//Para abrir/cerrar menu
function ver() {
    document.getElementById("theme-list").style.display = "block";
}

function ocultar() {
    document.getElementById("theme-list").style.display = "none";
}

function active_sailor_night() {
    document.getElementById("theme").href = sailor_night;
    document.getElementById("img-header").src = "/images/gifOF_logo_dark.png";
    document.getElementById("lupa").src = "/images/lupa.svg";
    setThemeLS();
}

function active_sailor_day() {
    document.getElementById("theme").href = sailor_day;
    document.getElementById("img-header").src = "/images/gifOF_logo.png";
    document.getElementById("lupa").src = "/images/lupa_inactive.svg";
    setThemeLS();
}

function setThemeLS() {
    theme = document.getElementById("theme").getAttribute("href");
    if (theme == sailor_day) {
        localStorage.setItem("theme", 1);
    } else {
        localStorage.setItem("theme", 2);
    }
}
setThemeLS();

//CAMBIO DE BOTONES
let boton = document.getElementsByClassName("btn-search")[0];
let lupa = document.getElementById("lupa");

//Hace que se puedan buscar gifs presionando enter
document.querySelector(".search-bar input").addEventListener("keydown", e => {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        document.querySelector(".btn-search").click();
        return false;
    } else {
        return true;
    }
});

// BARRA DE Busqueda
function getSearchResults() {
    document.querySelector(".search-results").style.display = "block";
    search = document.getElementById("search").value;
    const found = fetch(`${APIurl}search?q=${search}&api_key=${APIkey}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById("results").innerText = "Resultados de búsqueda: " + search;
            document.querySelector(".autocomplete-search").style.display = "none";
            innerGifs = document.getElementById("researched_gifs");
            innerGifs.innerHTML = "";
            for (var i = 0; i < 12; i++) {
                gifID = data.data[i].id;
                imgURL = data.data[i].images.original.url;
                gifDiv = document.createElement("div");
                gifDiv.className = "gif";
                innerGifs.appendChild(gifDiv);
                imgChild = document.createElement("img");
                imgChild.className = "img-gif";
                imgChild.src = imgURL;
                titleDiv = document.createElement("div");
                titleDiv.className = "title-gif";
                titleDiv.id = `gif-${i + 1}`;

                gifDiv.append(imgChild, titleDiv);

                titulo_gif = data.data[i].title.trim().split(" ");
                titulo_gif = titulo_gif.filter(del => del !== "GIF");
                for (var j = 0; j <= 2; j++) {
                    if (titulo_gif[j] !== undefined && titulo_gif[j] !== "") {
                        spanChild = document.createElement("span");
                        spanChild.innerHTML = `#${titulo_gif[j]}`;
                        document.getElementById(`gif-${i + 1}`).appendChild(spanChild);
                    }
                }
            }
        })
        .catch(error => {
            return error;
        });
    return found;
}


// Autocompletar

function resultadoSugerido() {
    autoComp = document.querySelector(".autocomplete-search");
    autoComp.style.display = "block";
    search = document.getElementById("search").value;
    if (search === "") {
        autoComp.style.display = "none";
    }
    fetch(`${APIurl}search?q=${search}&api_key=${APIkey}&limit=3`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            autoComp.innerHTML = "";
            for (let i = 0; i < data.data.length; i++) {
                imgTITLE = data.data[i].title;
                if (imgTITLE !== "") {
                    imgURL = data.data[i].bitly_url;
                    sug = document.createElement("p");
                    autoComp.appendChild(sug);
                    innerS = `<a onclick="getSearchResults()" target='_blank'>${imgTITLE}</a>`;
                    sug.innerHTML = innerS;
                }
            }
        });
}


// Limpiar resultados
function clearResults() {
    document.getElementById("researched_gifs").innerHTML = "";
    document.querySelector(".search-results").style.display = "none";
    document.getElementById("search")[0].placeholder = "Busca gifs, hashtags, temas, busca lo que quieras…";
}


// SUGERIDOS
function suggestedGifs(gif) {
    fetch(`${APIurl}search?q=${gif}&api_key=${APIkey}&limit=1`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let gif_box = document.createElement("div");
            gif_box.className = "gif-box";
            gif_box.innerHTML = `
          <div class='gif-title'>
            <span>#${gif}</span><span style='float: right;'><img src='/images/button3.svg' /></span>
          </div>
          <div class='gif-img'>
            <img src='${data.data[0].images.original.url}'>
            <span class='btn-gif'><a onclick="getSearchResults()" target='_blank'>Ver más...</a></span>
          </div>
        `;
            document.getElementById("gif_suggested").append(gif_box);
        });
}

let myArray = [
    "Tetris",
    "Pac-man",
    "Arcade",
    "Galaga",
];
let rand = function () {
    let myArraynew = [];
    let compara = myArray[Math.floor(Math.random() * myArray.length)];
    while (myArraynew.length < 4) {
        if (!myArraynew.includes(compara)) {
            myArraynew.push(compara);
        }
        compara = myArray[Math.floor(Math.random() * myArray.length)];
    }
    return myArraynew;
};
data = rand();
if (document.body.clientWidth < 500) {
    window.onload = suggestedGifs(data[Math.floor(Math.random() * data.length)]);
} else {
    for (let i = 0; i < data.length; i++) {
        window.onload = suggestedGifs(data[i]);
    }
}

//TENDENCIAS
function trendings() {
    const found = fetch(
            "https://api.giphy.com/v1/gifs/trending" + "?api_key=" + APIkey + '&limit=12')
        .then(response => {
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.data.length; i++) {
                let height = data.data[i].images.original.height;
                let width = data.data[i].images.original.width;
                let squareCheck = width / height;
                let imgURL = data.data[i].images.original.url;
                let gifTrend = document.createElement('div');
                gifTrend.className = 'gif';
                gifTrend.innerHTML = `<img class='img-gif' src='${imgURL}' /><div class='title-gif' id='trend-gif-${i +
                1}'></div>`
                document.getElementById('giftrending').appendChild(gifTrend);
                titulo_gif = data.data[i].title.trim().split(" ");
                titulo_gif = titulo_gif.filter(del => del !== "GIF");
                for (var j = 0; j <= 3; j++) {
                    if (titulo_gif[j] !== undefined && titulo_gif[j] !== "") {
                        let spanTituloGif = document.createElement('span');
                        spanTituloGif.innerHTML = `#${titulo_gif[j]}`;
                        document.getElementById(`trend-gif-${i + 1}`).appendChild(spanTituloGif);
                    }
                }
                if (squareCheck > 1.3 && document.body.clientWidth > 500) {
                    document
                        .querySelector(".gif:last-child")
                        .classList.add("double-span");
                }
            };
        });
    return found;
}

trendings();
