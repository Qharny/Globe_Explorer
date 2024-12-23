import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const fetchCountry = async (name: string) => {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${name}?fullText=true`
  );
  if (!response.ok) throw new Error("Failed to fetch country");
  const data = await response.json();
  return data[0];
};

const CountryDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: country, isLoading } = useQuery({
    queryKey: ["country", name],
    queryFn: () => fetchCountry(name || ""),
    enabled: !!name,
  });

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isAlreadyFavorite = favorites.includes(name);

    if (isAlreadyFavorite) {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites.filter((f: string) => f !== name))
      );
      toast({
        title: "Removed from favorites",
        description: `${name} has been removed from your favorites`,
      });
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, name]));
      toast({
        title: "Added to favorites",
        description: `${name} has been added to your favorites`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl">Country not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={toggleFavorite}
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Add to Favorites
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <img
            src={country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="mb-4 text-4xl font-bold">{country.name.common}</h1>
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold">Official Name</h2>
              <p>{country.name.official}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Capital</h2>
              <p>{country.capital?.[0] || "No capital"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Region</h2>
              <p>
                {country.region} ({country.subregion})
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Population</h2>
              <p>{country.population.toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Languages</h2>
              <p>
                {Object.values(country.languages || {}).join(", ") ||
                  "No languages"}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Currencies</h2>
              <p>
                {Object.values(country.currencies || {})
                  .map((currency: any) => currency.name)
                  .join(", ") || "No currencies"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;