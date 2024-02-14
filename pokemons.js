class Pokemon {
    constructor(pokemonData){
        this.name = pokemonData.data.name;
        this.url = pokemonData.url;
        this.generation = pokemonData.species.generation.name;
        this.image = pokemonData.data.sprites.front_default;
        this.id = pokemonData.data.id;
        this.abilities = pokemonData.data.abilities;
    }
}

class PokemonFactory {
    static async getPokemons (count = 1) {
        const pokemonsUrls = [];

        for (let i = 0; i < count; i++) {
            pokemonsUrls.push("https://pokeapi.co/api/v2/pokemon?limit=1&offset=" + Math.floor(Math.random() * 1000));
        }

        const pokemons = await Promise.all(pokemonsUrls.map(async (pokemonUrl) => {
            const pokemonUrlResponse = await fetch(pokemonUrl);
            const pokemon = await pokemonUrlResponse.json();

            const pokemonResponse = await fetch(pokemon.results[0].url);
            const pokemonData = await pokemonResponse.json();

            const pokemonSpeciesResponse = await fetch(pokemonData.species.url);
            const pokemonSpecies = await pokemonSpeciesResponse.json();

            return {
                species: pokemonSpecies,
                data: pokemonData,
                url: pokemon.url,
            };
        }));

        return pokemons;
    }

    static makePokemon (pokemonData) {
        return new Pokemon(pokemonData);
    }

    static async makePokemons(count) {
        const pokemonsData = await PokemonFactory.getPokemons(count);
        const pokemons = [];
        pokemonsData.forEach(pokemonData => {
            const pokemon = PokemonFactory.makePokemon(pokemonData);
            pokemons.push(pokemon);
        });
        return pokemons;
    }
};