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

        let pokemonData = {
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

        allPokemon.push(pokemonData);
    } catch (error) {
        console.error(`Fehler bei fetchPokemonInfoLoop(${pokemonName}):`, error);
    }
}

function saveAllPokemonLocal() {
    localStorage.setItem('savedAllPokemon', JSON.stringify(allPokemon));
}

async function renderPokemonCards(pokemon) {
    let pokemonId = pokemon.id;
    let pokemonName = pokemon.name;
    let pokemonSprite = pokemon.sprite;
    let pokemonType1 = pokemon.types[0];
    let pokemonType2 = pokemon.types[1] ? pokemon.types[1] : "";
    let pokemonColour2 = pokemon.types[1] ? pokemon.types[1] : pokemonType1;

    let content = document.getElementById('content');
    content.innerHTML += createPokemonCard(
        pokemonId,
        pokemonName,
        pokemonSprite,
        pokemonType1,
        pokemonType2,
        pokemonColour2);
}

async function openPokemonDetailFromSearch(pokemonId) {
    if (pokemonId < allPokemon.length) {
        openPokemonDetail(pokemonId);
    } if (pokemonId === allPokemon.length) {
        openPokemonDetail(pokemonId);
    } else {
        openFetchedPokemonDetail(pokemonId);
    }
}

async function openPokemonDetail(pokemonId) {
    let topContent = document.getElementById('pokemon_sprite');
    let pokemonDetails = allPokemon[pokemonId-1];
    let pokemonName = pokemonDetails.name;
    let pokemonSprites = pokemonDetails.sprite;
    let pokemonType1 = pokemonDetails.types[0];
    let pokemonColour2 = pokemonDetails.types[1] ? pokemonDetails.types[1] : pokemonType1;

    resetSearchResult();

    topContent.innerHTML = await createPokemonDetailTop(
        pokemonId,
        pokemonName,
        pokemonSprites,
        pokemonType1,
        pokemonColour2);

    pokemonDetailAbout(pokemonId);
    document.getElementById('pokemon_detail_wrapper').classList.remove('d-none');
}

async function pokemonDetailAbout(pokemonId) {
    let pokemonDetails = allPokemon[pokemonId-1];
    let bottomContent = document.getElementById('pokemon_info');

    let pokemonType1 = pokemonDetails.types[0];
    let pokemonType2 = pokemonDetails.types[1] ? pokemonDetails.types[1] : "";
    let pokemonHeight = pokemonDetails.height;
    let pokemonWeight = pokemonDetails.weight;
    let pokemonSpecies = pokemonDetails.species;
    let pokemonAbilitiy1 = pokemonDetails.abilities[0];
    let pokemonAbilitiy2 = pokemonDetails.abilities[1]?? "";
    let pokemonAbilitiy3 = pokemonDetails.abilities[2]?? "";

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

async function pokemonDetailStats(pokemonId) {
    let pokemonDetails = allPokemon[pokemonId-1];
    let bottomContent = document.getElementById('pokemon_info');

    let pokemonHp = pokemonDetails.stats.atk;
    let pokemonAtk = pokemonDetails.stats.def;
    let pokemonDef = pokemonDetails.stats.hp;
    let pokemonSpatk = pokemonDetails.stats.spatk;
    let pokemonSpdef = pokemonDetails.stats.spd;
    let pokemonSpd = pokemonDetails.stats.spdef;

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

async function openFetchedPokemonDetail(pokemonId) {
    document.getElementById('loading_screen').classList.remove('d-none');
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
    let topContent = document.getElementById('pokemon_sprite');
    let pokemonName = pokemonDetails.name;
    let pokemonSprites = pokemonDetails.sprites.front_default;
    let pokemonType1 = pokemonDetails.types[0].type.name;
    let pokemonColour2 = pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : pokemonType1;

    resetSearchResult();

    topContent.innerHTML = await createFetchedPokemonDetailTop(
        pokemonId,
        pokemonName,
        pokemonSprites,
        pokemonType1,
        pokemonColour2);

    fetchedPokemonDetailAbout(pokemonId);
    document.getElementById('pokemon_detail_wrapper').classList.remove('d-none');
    await document.getElementById('loading_screen').classList.add('d-none');
}

async function fetchedPokemonDetailAbout(pokemonId) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
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

async function fetchedPokemonDetailStats(pokemonId) {
    let pokemonDetails = await fetchData(`pokemon/${pokemonId}`);
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