import PokemonListComponent from './PokemonList';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">Pokédex</h1>
        <PokemonListComponent />
      </main>
    </div>
  );
}
