//init function for onload
function init() {
    includeHTML();
    loadMorePokemon();
}

//global variables
const BASE_URL = "https://pokeapi.co/api/v2/";
let offset = 0; // Startoffset for the first 18 Pokémon
const limit = 18; // amount of Pokémon for every call

//include header und footer
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

// fetch Data from API
async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path);
    return response.json();
}

// fetch Pokemon from API
async function loadPokemonData() {
    let data = await fetchData(`pokemon?limit=${limit}&offset=${offset}`);
    offset += limit;
    return data.results;
}

// render pokemon cards
function renderPokemonCards(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonName = pokemon.name;
        fetchPokemonDetails(pokemonName);
    }
}

async function fetchPokemonDetails(pokemonName) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonName}`);
    let pokemonId = pokemonDetails.id;
    let pokemonSprites = pokemonDetails.sprites.front_default;
    let pokemonType1 = pokemonDetails.types[0].type.name;
    let pokemonType2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : "";
    let pokemonColour2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : pokemonType1;

    let content = document.getElementById('content');
    content.innerHTML += createPokemonCard(pokemonId, pokemonName, pokemonSprites, pokemonType1, pokemonType2, pokemonColour2);
}

function createPokemonCard(pokemonId, pokemonName, pokemonSprites, pokemonType1, pokemonType2, pokemonColour2) {
    return `
        <div id="pkmn#${pokemonId}" onclick="openPokemonDetail(${pokemonId})" class="pokemon_card">
            <div class="pkmn_card_top">
                <div>
                    #${pokemonId}
                </div>
                <div>
                    ${pokemonName}
                </div>
            </div>
            <img class="pokemon_img" src="${pokemonSprites}" alt="${pokemonName}_img">
            <div class="center">
                <span class="type_box ${pokemonType1}">${pokemonType1}</span>
                <span class="type_box ${pokemonType2}">${pokemonType2}</span>
            </div>
            <div class="type_circle">
                <div class="upper_half ${pokemonType1}"></div>
                <div class="lower_half ${pokemonColour2}"></div>
                <div class="center_circle"></div>
            </div>
        </div>
    `;
}

// render pokemon cards
async function openPokemonDetail(pokemonId) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
    let pokemonInfo = document.getElementById('pokemon_info');
    
    pokemonInfo.innerHTML = createGeneralPokemonInfo();
}

// load pokemon cards
async function loadMorePokemon() {
    let pokemonList = await loadPokemonData();
    await renderPokemonCards(pokemonList);
}



// Tests
let promError = false;

function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("1")
            if (promError) {
                reject();
            } else {
                resolve();
            }
        }, 1000);
    });
}

function getPromise2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("2")
            if (promError) {
                reject("hat nicht geklappt");
            } else {
                resolve("hat geklappt");
            }
        }, 1000);
    });
}

function getPromise3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("3")
            if (promError) {
                reject("hat nicht geklappt");
            } else {
                resolve("hat geklappt");
            }
        }, 1000);
    });
}

async function usePromise() {
    try {
        await getPromise();
        await getPromise2();
        await getPromise3();
        console.log("Erfolg")
    } catch (error) {
        console.log(error)
    }
    console.log("Abgeschlossen")
}