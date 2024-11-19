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
async function renderPokemonCards(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonName = pokemon.name;
        await fetchPokemonDetails(pokemonName);
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
    content.innerHTML += createPokemonCard(
        pokemonId, 
        pokemonName, 
        pokemonSprites, 
        pokemonType1, 
        pokemonType2, 
        pokemonColour2);
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

// render pokemon infos
async function openPokemonDetail(pokemonId) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
    let topContent = document.getElementById('pokemon_sprite');

    let pokemonName = pokemonDetails.name;
    let pokemonSprites = pokemonDetails.sprites.front_default;
    let pokemonType1 = pokemonDetails.types[0].type.name;
    let pokemonType2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : "";
    let pokemonColour2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : pokemonType1;

    topContent.innerHTML = await createPokemonDetailTop(
        pokemonId, 
        pokemonName, 
        pokemonSprites, 
        pokemonType1, 
        pokemonColour2);

        pokemonDetailAbout(pokemonName);
     document.getElementById('pokemon_detail_wrapper').classList.remove('d-none');
}

function createPokemonDetailTop(pokemonId, pokemonName, pokemonSprites, pokemonType1, pokemonColour2) {
    return `
        <div class="pkmn_detail">
            <div class="pkmn_detail_top">
                <div>
                    #${pokemonId}
                </div>
                <div>
                    ${pokemonName}
                </div>
            </div>
            <img class="pokemon_img" src="${pokemonSprites}" alt="${pokemonName}_img">
            <div class="type_circle_detail">
                <div class="upper_half ${pokemonType1}"></div>
                <div class="lower_half ${pokemonColour2}"></div>
                <div class="center_circle"></div>
            </div>
            <div class="pkmn_detail_bottom">
                <div class="detail_buttons">
                    <button onclick="pokemonDetailAbout('${pokemonName}')">About</button>
                    <button onclick="pokemonDetailStats('${pokemonName}')">Stats</button>
                </div>
            </div>
            <img class="left-button icon" onclick="leftImage(${pokemonId-1})" src="assets/icons/left.png">
            <img class="right-button icon" onclick="rightImage(${pokemonId+1})" src="assets/icons/right.png">
        </div>
    `;
}

//render pokemon about
async function pokemonDetailAbout(pokemonName) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonName}`);
    let bottomContent = document.getElementById('pokemon_info');

    let pokemonType1 = pokemonDetails.types[0].type.name;
    let pokemonType2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : "";
    let pokemonHeight = pokemonDetails.height / 10;
    let pokemonWeight = pokemonDetails.weight / 10;
    let pokemonSpecies = pokemonDetails.species.name;
    let pokemonAbilitiy1 = pokemonDetails.abilities[0].ability.name;
    let pokemonAbilitiy2 = pokemonDetails.abilities?.[1]?.ability?.name ?? "";
    let pokemonAbilitiy3 = pokemonDetails.abilities?.[2]?.ability?.name ?? "";

    bottomContent.innerHTML = createPokemonDetailAbout(
        pokemonType1, 
        pokemonType2,
        pokemonSpecies,
        pokemonHeight,
        pokemonWeight,
        pokemonAbilitiy1,
        pokemonAbilitiy2,
        pokemonAbilitiy3);
}

function createPokemonDetailAbout(pokemonType1, pokemonType2, pokemonSpecies, pokemonHeight, pokemonWeight, pokemonAbility1, pokemonAbility2, pokemonAbility3) {
    return `
    <table>
            <tr>
            <td>Type:</td>
            <td><span class="type_box ${pokemonType1}">${pokemonType1}</span></td>
            <td><span class="type_box ${pokemonType2}">${pokemonType2}</span></td>
        </tr>
        </table>
    <table>
        <tr>
            <td>Species:</td>
             <td>${pokemonSpecies}</td>
        </tr>
        <tr>
            <td>Height:</td>
            <td>${pokemonHeight} m</td>
        </tr>
        <tr>
            <td>Weight:</td>
            <td>${pokemonWeight} kg</td>
        </tr>
        <tr>
            <td>Abilities:</td>
            <td>${pokemonAbility1} ${pokemonAbility2} ${pokemonAbility3}</td>
        </tr>
    </table>
    `;
}

//render pokemon stats
async function pokemonDetailStats(pokemonName) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonName}`);
    let bottomContent = document.getElementById('pokemon_info');

    let pokemonHp = pokemonDetails.stats[0].base_stat;
    let pokemonAtk = pokemonDetails.stats[1].base_stat;
    let pokemonDef = pokemonDetails.stats[2].base_stat;
    let pokemonSpatk = pokemonDetails.stats[3].base_stat;
    let pokemonSpdef = pokemonDetails.stats[4].base_stat;
    let pokemonSpd = pokemonDetails.stats[5].base_stat;

    bottomContent.innerHTML = createPokemonDetailStats(
        pokemonHp, 
        pokemonAtk,
        pokemonDef,
        pokemonSpatk,
        pokemonSpdef,
        pokemonSpd);
}

function createPokemonDetailStats(pokemonHp, pokemonAtk, pokemonDef, pokemonSpatk, pokemonSpdef, pokemonSpd) {
    return `
    <table>
        <tr>
            <td>HP:</td>
             <td>${pokemonHp}</td>
        </tr>
        <tr>
            <td>Attack:</td>
             <td>${pokemonAtk}</td>
        </tr>
        <tr>
            <td>Defense:</td>
            <td>${pokemonDef}</td>
        </tr>
        <tr>
            <td>Special-attack:</td>
             <td>${pokemonSpatk}</td>
        </tr>
        <tr>
            <td>Special-defense:</td>
             <td>${pokemonSpdef}</td>
        </tr>
        <tr>
            <td>Speed:</td>
            <td>${pokemonSpd}</td>
        </tr>
    </table>
    `;
}

function closePokemonDetail(event) {
    // Überprüfen, ob der Klick außerhalb des Dialogs war
    const wrapper = document.getElementById('pokemon_detail_wrapper');
    if (event.target === wrapper.querySelector('.pokemon_detail_bg')) {
        wrapper.classList.add('d-none');
    }
}

// load pokemon cards
async function loadMorePokemon() {
    document.getElementById('loading_screen').classList.remove('d-none');
    let pokemonList = await loadPokemonData();
    await renderPokemonCards(pokemonList);
    await document.getElementById('loading_screen').classList.add('d-none');
}

// switch to next or previous card
  function leftImage(previous) {
    if (previous == 0) {
        openPokemonDetail(previous+1)
    } else {
        openPokemonDetail(previous)
    }
  }
  
  function rightImage(next) {
    if (next == offset+1) {
        openPokemonDetail(next-1)
    } else {
        openPokemonDetail(next)
    }
  }

// search for Pokemon



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