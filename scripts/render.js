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