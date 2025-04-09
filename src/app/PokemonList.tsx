"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchPokemon, fetchPokemonById, fetchTotalPokemonCount, fetchPokemonDetails } from './pokemonApi';

interface Pokemon {
    name: string;
    url: string;
}

interface PokemonResponse {
    results: Pokemon[];
}

export default function PokemonList() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pokemonById, setPokemonById] = useState<(Pokemon & { image: string; details?: { types: string[]; evolutions: { name: string; id: number }[] } }) | null>(null);
    const [totalPokemon, setTotalPokemon] = useState<number | null>(null);

    const { data, error, isLoading } = useQuery<PokemonResponse, Error>({
        queryKey: ['pokemon', page],
        queryFn: () => fetchPokemon(page),
    });

    useEffect(() => {
        fetchTotalPokemonCount().then(setTotalPokemon).catch(() => setTotalPokemon(null));
    }, []);

    useEffect(() => {
        const searchNumber = parseInt(search, 10);
        if (!isNaN(searchNumber)) {
            fetchPokemonById(searchNumber)
                .then(async (pokemon) => {
                    const details = await fetchPokemonDetails(searchNumber);
                    setPokemonById({ ...pokemon, details });
                })
                .catch(() => setPokemonById(null));
        } else {
            setPokemonById(null);
        }
    }, [search]);

    const filteredPokemon = pokemonById
        ? [pokemonById]
        : data?.results.filter((pokemon: Pokemon) => {
            const searchLower = search.toLowerCase();
            return pokemon.name.toLowerCase().includes(searchLower);
        });

    const totalPages = totalPokemon ? Math.ceil(totalPokemon / 30) : null;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full max-w-md">
            <input
                type="text"
                placeholder="Search by name or number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            {pokemonById && pokemonById.details ? (
                <div className="flex flex-col items-center">
                    <img src={pokemonById.image} alt={pokemonById.name} className="w-32 h-32 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">{pokemonById.name}</h2>
                    <p className="mb-2">Types: {pokemonById.details.types.join(', ')}</p>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-4 mb-2">
                            {pokemonById.details.evolutions.map((evolution) => (
                                <img
                                    key={evolution.id}
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                                    alt={`Pokemon ID ${evolution.id}`}
                                    className="w-16 h-16"
                                />
                            ))}
                        </div>
                        <div className="flex gap-4 mb-4">
                            {pokemonById.details.evolutions.map((evolution) => (
                                <span key={evolution.id} className="text-center">{evolution.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <ul className="grid grid-cols-3 gap-4 !mt-10 !mb-10 !border border-white rounded">
                    {filteredPokemon?.map((pokemon: Pokemon & { image?: string }) => {
                        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
                        return (
                            <li key={pokemon.name} className="mb-4 flex items-center gap-4">
                                {pokemon.image && (
                                    <img
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        className="w-16 h-16"
                                    />
                                )}
                                <span>#{pokemonId} {pokemon.name}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
            {!pokemonById && (
                <div className="flex flex-col items-center mt-4">
                    <div className="mb-2">Page {page} of {totalPages}</div>
                    <div className="flex justify-between w-full">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => (totalPages && prev < totalPages ? prev + 1 : prev))}
                            disabled={totalPages !== null && page >= totalPages}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}