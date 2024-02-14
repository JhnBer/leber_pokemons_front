const pokemonListWrapper = document.querySelector('#pokemons-list');
const pokemonGetButton = document.querySelector('#pokemons-button');
const pokemonAddButton = document.querySelector('#pokemons-button-add');
const sortInput = document.querySelector('#sort-field');
const sortButton = document.querySelector('#sort-button');
const statuses = {};
let pokemons = [];
let originalOrderPokemons = [];

const renderPokemons = (pokemons, sortField = null, sortMode = null) => {
    const pokemonTemplate = (pokemon) => {
        let abils = ``;
        pokemon.abilities.forEach(ability => {
            abils += `<li>${ability.ability.name}</li>`;
        });
        return `
        <div class="flex flex-col w-1/5 mb-8 px-5 min-h-full">
            <div class="border-2 border-blue-500 bg-blue-50 rounded-xl h-full">
                <img class="my-10 mx-auto w-20 h-20" src="${pokemon.image}" alt="">
                <div class="px-8 pb-8">
                    <p class="mb-2">
                        <span class="font-medium">ID:</span> ${pokemon.id}
                    </p>
                    <p class="mb-2">
                        <span class="font-medium">Name:</span> ${pokemon.name}
                    </p>
                    <p class="mb-2">
                        <span class="font-medium">Generation:</span> ${pokemon.generation}
                    </p>
                    <p class="">
                        <span class="font-medium">Abilities:</span>
                        <ul>
                            ${abils}
                        </ul>
                    </p>
                </div>
            </div>
            
        </div>
        `;
    }

    if(sortField && (sortMode == 'asc' || 'desc')){
        if(sortField == 'id' || sortField == 'generation' || sortField == 'name'){
            if(sortMode == 'asc'){
                pokemons.sort((a, b) => a[sortField] > b[sortField] ? 1 : -1);
            }
            if(sortMode == 'desc'){
                pokemons.sort((a, b) => a[sortField] < b[sortField] ? 1 : -1);
            }
        }
    }

    if(sortMode == 'none' && originalOrderPokemons.length > 0){
        pokemons = [...originalOrderPokemons];
    }

    pokemonListWrapper.innerHTML = '';

    let pokemonsList = '';
    pokemons.forEach(pokemon => {
        pokemonsList += pokemonTemplate(pokemon);
    });

    pokemonListWrapper.innerHTML = pokemonsList;
}

const getPokemons = async (count = 5) => {
    const pokemonsData = await PokemonFactory.makePokemons(count);
    
    return pokemonsData;
};

const freezeButtons = (state) => {
    if(!state){
        pokemonGetButton.removeAttribute('disabled');
        pokemonAddButton.removeAttribute('disabled');
    }else{
        pokemonGetButton.setAttribute('disabled', true);
        pokemonAddButton.setAttribute('disabled', true);
    }
}

pokemonGetButton.addEventListener('click', async () => {
    freezeButtons(true);
    pokemons = await getPokemons();

    freezeButtons(false);

    originalOrderPokemons = [...pokemons];
    renderPokemons(pokemons, sortInput.value, sortButton.getAttribute('data-direction'));
});

pokemonAddButton.addEventListener('click', async () => {
    freezeButtons(true);
    const newPokemons = await getPokemons();

    freezeButtons(false);

    pokemons = pokemons.concat(newPokemons);
    originalOrderPokemons = originalOrderPokemons.concat(newPokemons);
    renderPokemons(pokemons, sortInput.value, sortButton.getAttribute('data-direction'));
});

sortButton.addEventListener('click', () => {
    sortButton.classList.toggle('rotate-180');

    switch (sortButton.getAttribute('data-direction')) {
        case 'desc':
            sortButton.setAttribute('data-direction', 'none');
            sortButton.innerHTML = 'X'
            break;
        case 'asc':
            sortButton.setAttribute('data-direction', 'desc');
            sortButton.innerHTML = '&uarr;'
            break;
        default:
            sortButton.setAttribute('data-direction', 'asc');
            sortButton.classList.remove('rotate-180');
            sortButton.innerHTML = '&uarr;'
            break;
    }
    
    renderPokemons(pokemons, sortInput.value, sortButton.getAttribute('data-direction'));
});


sortInput.addEventListener('change', () => {
    renderPokemons(pokemons, sortInput.value, sortButton.getAttribute('data-direction'));
});

 




