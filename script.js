function init() {
    includeHTML();
    loadPokemon();
    loadPokemonNames();
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

async function fetchData(path = "") {
    try {
        let response = await fetch(BASE_URL + path);
        return await response.json();
    } catch (error) {
        console.error(`Fehler bei fetchData(${endpoint}):`, error);
    }
}

async function fetchPokemonCount() {
    let data = await fetchData(`pokemon`);
    return data.count;
}

async function loadPokemonNames() {
    let count = await fetchPokemonCount();
    getPokemonNamesLocalStorage();
    if (count === PokemonNames.length) {

    } else {
        let data = await fetchData(`pokemon?limit=${count}&offset=0`);
        PokemonNames = data.results.map(pokemon => pokemon.name);
        savePokemonNamesLocal();
    }
}

function getPokemonNamesLocalStorage() {
    let savedPokemonNames = localStorage.getItem('savedPokemonNames');
    if (savedPokemonNames) {
        PokemonNames = JSON.parse(savedPokemonNames);
    }
}

function savePokemonNamesLocal() {
    localStorage.setItem('savedPokemonNames', JSON.stringify(PokemonNames));
}

async function loadPokemon() {
    document.getElementById('loading_screen').classList.remove('d-none');
    await getAllPokemonLocalStorage();

    if (allPokemon.length > 0) {
        console.log("Pokémon-Daten sind bereits geladen.");
    } else {
        console.log("Pokémon-Daten fehlen, fetch wird gestartet.");
        await fetchPokemon();
    }

    await saveAllPokemonLocal();
    for (let i = 0; i < limit; i++) {
        let pokemon = allPokemon[i];
        await renderPokemonCards(pokemon);
    }
    offset += limit;
    await document.getElementById('loading_screen').classList.add('d-none');
}

function getAllPokemonLocalStorage() {
    let savedAllPokemon = localStorage.getItem('savedAllPokemon');
    if (savedAllPokemon) {
        allPokemon = JSON.parse(savedAllPokemon);
    }
}

async function loadMorePokemon() {
    document.getElementById('loading_screen').classList.remove('d-none');
    if (allPokemon.length === offset) {
        await fetchPokemon();
        await saveAllPokemonLocal();
        for (let i = offset; i < offset + limit; i++) {
            let pokemon = allPokemon[i];
            await renderPokemonCards(pokemon);
        }
        offset = allPokemon.length;
    } else {

        for (let i = offset; i < offset + limit; i++) {
            let pokemon = allPokemon[i];
            await renderPokemonCards(pokemon);
        }
        offset += limit;
    }
    await document.getElementById('loading_screen').classList.add('d-none');
}

async function fetchPokemon() {
    try {
        let pokemonList = await fetchData(`pokemon?limit=${limit}&offset=${offset}`);

        for (let i = 0; i < pokemonList.results.length; i++) {
            let pokemon = pokemonList.results[i];
            let pokemonName = pokemon.name;
            await fetchPokemonInfoLoop(pokemonName);
        }

        console.log("Pokémon-Daten erfolgreich geladen:", allPokemon);
    } catch (error) {
        console.error("Fehler bei fetchPokemon():", error);
    }
}

async function fetchPokemonInfoLoop(pokemonName) {
    try {
        let pokemonDetails = await fetchData(`pokemon/${pokemonName}`);
        let pokemonData =  await transformPokemonData(pokemonDetails);

        allPokemon.push(pokemonData);
    } catch (error) {
        console.error(`Fehler bei fetchPokemonInfoLoop(${pokemonName}):`, error);
    }
}

function transformPokemonData(pokemonDetails) {
    return { 
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        sprite: pokemonDetails.sprites.front_default,
        types: [
            pokemonDetails.types[0].type.name,
            pokemonDetails.types[1]?.type.name || ""
        ],
        height: pokemonDetails.height / 10,
        weight: pokemonDetails.weight / 10,
        species: pokemonDetails.species.name,
        abilities: [
            pokemonDetails.abilities[0]?.ability.name || "",
            pokemonDetails.abilities[1]?.ability.name || "",
            pokemonDetails.abilities[2]?.ability.name || ""
        ],
        stats: {
            hp: pokemonDetails.stats[0].base_stat,
            atk: pokemonDetails.stats[1].base_stat,
            def: pokemonDetails.stats[2].base_stat,
            spatk: pokemonDetails.stats[3].base_stat,
            spdef: pokemonDetails.stats[4].base_stat,
            spd: pokemonDetails.stats[5].base_stat
        }
    };
}

function saveAllPokemonLocal() {
    localStorage.setItem('savedAllPokemon', JSON.stringify(allPokemon));
}

function closePokemonDetail(event) {
    const wrapper = document.getElementById('pokemon_detail_wrapper');
    if (event.target === wrapper.querySelector('.pokemon_detail_bg')) {
        wrapper.classList.add('d-none');
    }
}

function leftImage(previous) {
    if (previous == 0) {
        openPokemonDetail(previous + 1)
    } else {
        openPokemonDetail(previous)
    }
}

function rightImage(next) {
    if (next == offset + 1) {
        openPokemonDetail(next - 1)
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

    let matchedPokemon = PokemonNames.filter(pokemon => pokemon.includes(searchName));
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