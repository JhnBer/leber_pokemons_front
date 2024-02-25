let pokemons = [];
let originalOrderPokemons = [];

const romanToNum = (roman) => {
    if (roman === "")           return 0;
    if (roman.startsWith("l"))  return 50 + romanToNum(roman.substr(1));
    if (roman.startsWith("xl")) return 40 + romanToNum(roman.substr(2));
    if (roman.startsWith("x"))  return 10 + romanToNum(roman.substr(1));
    if (roman.startsWith("ix")) return 9  + romanToNum(roman.substr(2));
    if (roman.startsWith("v"))  return 5  + romanToNum(roman.substr(1));
    if (roman.startsWith("iv")) return 4  + romanToNum(roman.substr(2));
    if (roman.startsWith("i"))  return 1  + romanToNum(roman.substr(1));
    return 0;
}

const getPokemons = async (count = 5) => {
    const pokemonsData = await PokemonFactory.makePokemons(count);
    return pokemonsData;
};

const handleGetPokemonsClick = async () => {
    pokemons = await getPokemons();
    originalOrderPokemons = [...pokemons];
}

const handleAddPokemonsClick = async () => {
    const newPokemons = await getPokemons();
    pokemons = pokemons.concat(newPokemons);
    originalOrderPokemons = originalOrderPokemons.concat(newPokemons);
}

document.addEventListener('alpine:init', () => {
    Alpine.data('pokemonApp', () => ({
        pokemons: [],
        sortDirection: 'none',

        sortPokemons () {
            const sortField = this.$refs.sortField.value;

            if(sortField && (this.sortDirection == 'asc' || 'desc')){
                if(sortField == 'generation'){
                    this.pokemons.sort((a, b) => {
                        a = romanToNum(a['generation'].split('-').pop());
                        b = romanToNum(b['generation'].split('-').pop());
                        if(this.sortDirection == 'asc'){
                            return a > b ? 1 : -1;
                        }
                        return a < b ? 1 : -1;
                    });
                }
                if(sortField == 'id' || sortField == 'name'){
                    if(this.sortDirection == 'asc'){
                        this.pokemons.sort((a, b) => a[sortField] > b[sortField] ? 1 : -1);
                    }
                    if(this.sortDirection == 'desc'){
                        this.pokemons.sort((a, b) => a[sortField] < b[sortField] ? 1 : -1);
                    }
                }
            }
        
            if(this.sortDirection == 'none' && originalOrderPokemons.length > 0){
                this.pokemons = [...originalOrderPokemons];
            }
        },

        freezeButtons (state) {
            if(!state){
                this.$refs.getPokemonsButton.removeAttribute('disabled');
                this.$refs.addPokemonsButton.removeAttribute('disabled');
            }else{
                this.$refs.getPokemonsButton.setAttribute('disabled', true);
                this.$refs.addPokemonsButton.setAttribute('disabled', true);
            }
        },

        changeSortDirection () {
            this.$refs.sortDirection.classList.toggle('rotate-180');

            switch (this.sortDirection) {
                case 'desc':
                    this.sortDirection = 'none';
                    this.$refs.sortDirection.innerHTML = 'X'
                    break;
                case 'asc':
                    this.sortDirection = 'desc';
                    this.$refs.sortDirection.innerHTML = '&uarr;'
                    break;
                default:
                    this.sortDirection = 'asc';
                    this.$refs.sortDirection.classList.remove('rotate-180');
                    this.$refs.sortDirection.innerHTML = '&uarr;'
                    break;
            }

            this.$refs.sortDirection.setAttribute('data-direction', this.sortDirection);
            this.sortPokemons();
        },

        async getPokemons () {
            this.freezeButtons(true);
            await handleGetPokemonsClick();
            this.freezeButtons(false);
            this.pokemons = pokemons;
            this.sortPokemons();
        },

        async addPokemons () {
            this.freezeButtons(true);
            await handleAddPokemonsClick();
            this.freezeButtons(false);
            this.pokemons = pokemons;
            this.sortPokemons();
        },

    }));
});




