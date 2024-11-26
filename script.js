function init() {
    includeHTML();
    loadMorePokemon();
    loadSavedPokemon();
    closePokemonSearch();
}

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

// fetch from API
async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path);
    return response.json();
}

// get from local storage
function getAllPokemonLocalStorage() {
    let savedAllPokemon = localStorage.getItem('savedAllPokemon');
    if (savedAllPokemon) {
        allPokemon = JSON.parse(savedAllPokemon);
    }
}

// load data (get local storage or fetch from api)
async function loadPokemonData() {
    let data = await fetchData(`pokemon?limit=${limit}&offset=${offset}`);
    offset += limit;
    return data.results;
}

async function fetchPokemonCount() {
    let data = await fetchData(`pokemon`);
    return data.count;
}

async function loadSavedPokemon() {
    let count = await fetchPokemonCount();
    if (localStorage.getItem('savedAllPokemon')) {
        getAllPokemonLocalStorage();
    } else {
        let data = await fetchData(`pokemon?limit=${count}&offset=0`);
        allPokemon = data.results.map(pokemon => pokemon.name);
        saveAllPokemonLocal();
    }
}

// render
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

async function openPokemonDetail(pokemonId) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
    let topContent = document.getElementById('pokemon_sprite');
    let pokemonName = pokemonDetails.name;
    let pokemonSprites = pokemonDetails.sprites.front_default;
    let pokemonType1 = pokemonDetails.types[0].type.name;
    let pokemonType2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : "";
    let pokemonColour2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : pokemonType1;

    resetSearchResult();

    topContent.innerHTML = await createPokemonDetailTop(
        pokemonId, 
        pokemonName, 
        pokemonSprites, 
        pokemonType1, 
        pokemonColour2);

        pokemonDetailAbout(pokemonName);
     document.getElementById('pokemon_detail_wrapper').classList.remove('d-none');
}

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

function closePokemonDetail(event) {
    const wrapper = document.getElementById('pokemon_detail_wrapper');
    if (event.target === wrapper.querySelector('.pokemon_detail_bg')) {
        wrapper.classList.add('d-none');
    }
}

async function loadMorePokemon() {
    document.getElementById('loading_screen').classList.remove('d-none');
    let pokemonList = await loadPokemonData();
    await renderPokemonCards(pokemonList);
    await document.getElementById('loading_screen').classList.add('d-none');
}

function saveAllPokemonLocal() {
    localStorage.setItem('savedAllPokemon', JSON.stringify(allPokemon));
}

function savePokemonCardsLocal() {
    localStorage.setItem('savedPokemonCards', JSON.stringify(PokemonCards));
}

function savePokemonDetailsLocal() {
    localStorage.setItem('savedPokemonDetails', JSON.stringify(PokemonDetails));
}

function loadPokemonCardsLocal() {
    let savedPokemonCards = localStorage.getItem('savedPokemonCards');
    if (savedPokemonCards) {
        PokemonCards = JSON.parse(savedPokemonCards);
    }
    renderBasket();
    render();
}

function loadPokemonDetailsLocal() {
    let savedPokemonDetails = localStorage.getItem('savedPokemonDetails');
     if (savedPokemonDetails) {
        PokemonDetails = JSON.parse(savedPokemonDetails);
    } 
    renderBasket();
    render();
}

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

function searchPokemon(event) {
    event.preventDefault();

    let inputField = document.getElementById("pokemonInput");
    let searchName = inputField.value.trim().toLowerCase();

    if (searchName.length < 3) {
        displayResult("Bitte mindestens 3 Buchstaben eingeben.");
        return;
    }

    let matchedPokemon = allPokemon.filter(pokemon => pokemon.includes(searchName));
    let limitedResults = matchedPokemon.slice(0, 6);
    currentPokemon = [...limitedResults];
    renderFoundPokemon(searchName);
}

async function renderFoundPokemon(searchName) {
    document.getElementById('searchResult').classList.remove('d-none');
    document.getElementById('searchResult').classList.add('searchResult');
    if (currentPokemon.length > 0) {
        for (let i = 0; i < currentPokemon.length; i++) {
            let pokemon = currentPokemon[i];
            await fetchFoundPokemon(pokemon);
        }
    } else {
        displayResult(`Keine Pokémon gefunden, die "${searchName}" enthalten.`);
    }
}

async function fetchFoundPokemon(pokemonName) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonName}`);
    let pokemonId = pokemonDetails.id;
    let pokemonSprites = pokemonDetails.sprites.front_default;

    let content = document.getElementById('searchResult');
    content.innerHTML += createFoundPokemon(pokemonId, pokemonName, pokemonSprites);
}

function resetSearchResult() {
    let content = document.getElementById('searchResult');
    content.innerHTML = "";
    document.getElementById('searchResult').classList.remove('searchResult');
    document.getElementById('searchResult').classList.add('d-none');
}

function closePokemonSearch() {
    document.addEventListener("click", function (event) {
        let searchResultDiv = document.getElementById("searchResult");

        if (!searchResultDiv.contains(event.target)) {
            resetSearchResult();
        }
    });
}

function displayResult(message) {
    let resultDiv = document.getElementById("searchResult");
    resultDiv.innerHTML = createSearchError(message);
}