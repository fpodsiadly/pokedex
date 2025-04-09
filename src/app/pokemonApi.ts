export async function fetchPokemon(page: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${(page - 1) * 30}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
}

export async function fetchPokemonById(id: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokemon by ID');
    }
    const data = await response.json();
    return {
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${id}`,
        image: data.sprites.front_default,
    };
}

export async function fetchTotalPokemonCount() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species');
    if (!response.ok) {
        throw new Error('Failed to fetch total Pokemon count');
    }
    const data = await response.json();
    return data.count;
}

export async function fetchPokemonDetails(id: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokemon details');
    }
    const data = await response.json();
    const types = data.types.map((type: { type: { name: string } }) => type.type.name);

    const speciesResponse = await fetch(data.species.url);
    if (!speciesResponse.ok) {
        throw new Error('Failed to fetch Pokemon species details');
    }
    const speciesData = await speciesResponse.json();

    const evolutionsResponse = await fetch(speciesData.evolution_chain.url);
    if (!evolutionsResponse.ok) {
        throw new Error('Failed to fetch Pokemon evolution chain');
    }
    const evolutionsData = await evolutionsResponse.json();

    const evolutions: { name: string; id: number }[] = [];
    let current = evolutionsData.chain;
    while (current) {
        const id = parseInt(current.species.url.split('/').filter(Boolean).pop(), 10);
        evolutions.push({ name: current.species.name, id });
        current = current.evolves_to[0];
    }

    return { types, evolutions };
}