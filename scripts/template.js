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

function createPokemonDetailTop(pokemonId, pokemonName, pokemonSprites, pokemonType1, pokemonColour2) {
    if (pokemonId === 1) {
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
            <img class="right-button icon" onclick="rightImage(${pokemonId+1})" src="assets/icons/right.png">
        </div>
    `;
    } else {
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

function createFoundPokemon(pokemonId, pokemonName, pokemonSprites) {
    return `
    <div onclick="openPokemonDetail(${pokemonId})" class="pokemon_card_small">
        <div class="pkmn_search">
                ${pokemonName}
        </div>
        <img class="search_img" src="${pokemonSprites}" alt="${pokemonName}_img">
    </div>
`;
}

function createSearchError(message) {
    return `
    <div class="pokemon_card_small">
        ${message}
    </div>
`;
}