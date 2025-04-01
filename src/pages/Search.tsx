import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, LogOut, Search as SearchIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBreeds, searchDogs, getDogs, getMatch } from '../api';
import { Dog } from '../types';
import toast from 'react-hot-toast';

export default function Search() {
  const { isAuthenticated, logout } = useAuth();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds();
        setBreeds(breedList);
      } catch (error) {
        toast.error('Failed to fetch breeds');
      }
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      setIsLoading(true);
      try {
        const searchParams = {
          breeds: selectedBreeds,
          sort: `breed:${sortOrder}`,
          size: 20,
          from: currentPage || undefined,
        };
        
        const searchResponse = await searchDogs(searchParams);
        const dogList = await getDogs(searchResponse.resultIds);
        setDogs(dogList);
      } catch (error) {
        toast.error('Failed to fetch dogs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDogs();
  }, [selectedBreeds, sortOrder, currentPage]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  };

  const handleMatch = async () => {
    try {
      const favoriteIds = Array.from(favorites);
      if (favoriteIds.length === 0) {
        toast.error('Please favorite at least one dog first');
        return;
      }
      
      const { match } = await getMatch(favoriteIds);
      const [matchedDogData] = await getDogs([match]);
      setMatchedDog(matchedDogData);
      toast.success('Found your perfect match!');
    } catch (error) {
      toast.error('Failed to find a match');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dog</h1>
          <button
            onClick={() => logout()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <select
                multiple
                value={selectedBreeds}
                onChange={(e) => setSelectedBreeds(Array.from(e.target.selectedOptions, option => option.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
              <button
                onClick={handleMatch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Find Match ({favorites.size})
              </button>
            </div>
          </div>

          {matchedDog && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Perfect Match! 🎉</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  className="w-full md:w-64 h-64 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold">{matchedDog.name}</h3>
                  <p className="text-gray-600">{matchedDog.breed}</p>
                  <p className="text-gray-600">{matchedDog.age} years old</p>
                  <p className="text-gray-600">Location: {matchedDog.zip_code}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full text-center py-12">Loading...</div>
            ) : (
              dogs.map((dog) => (
                <div key={dog.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="relative">
                    <img
                      src={dog.img}
                      alt={dog.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(dog.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full ${
                        favorites.has(dog.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-400'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-medium text-gray-900">{dog.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{dog.breed}</p>
                    <p className="mt-1 text-sm text-gray-500">{dog.age} years old</p>
                    <p className="mt-1 text-sm text-gray-500">Location: {dog.zip_code}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}