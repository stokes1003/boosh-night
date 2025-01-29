import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Movie } from "../App";
import { AutocompleteMovie } from "../App";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchMovies() {
  const query = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get("/.netlify/functions/getMovies");
      return response.data;
    },
  });
  return query.data;
}
export function useFetchWatchedMovies() {
  const query = useQuery({
    queryKey: ["watched-movies"],
    queryFn: async () => {
      const response = await axios.get("/.netlify/functions/getWatchedMovies");
      return response.data;
    },
  });
  return query.data;
}
export function useHasRated() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      selectedRows,
      currentRating,
    }: {
      selectedRows: number[];
      currentRating: number;
    }) => {
      const response = await axios.put("/.netlify/functions/hasRated", {
        data: {
          ids: selectedRows,
          hasRated: currentRating,
        },
      });
      const watched = response.data.filter((movie: Movie) => movie.hasWatched);
      const hasNotWatched = response.data.filter(
        (movie: Movie) => !movie.hasWatched
      );

      queryClient.setQueryData(["watched-movies"], watched);
      queryClient.setQueryData(["movies"], hasNotWatched);
    },
  });
  return mutation.mutate;
}

export function useHasWatched() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (selectedRows: number[]) => {
      const response = await axios.put("/.netlify/functions/watchedMovie", {
        data: {
          ids: selectedRows,
        },
      });
      const watched = response.data.filter((movie: Movie) => movie.hasWatched);
      const hasNotWatched = response.data.filter(
        (movie: Movie) => !movie.hasWatched
      );

      queryClient.setQueryData(["watched-movies"], watched);
      queryClient.setQueryData(["movies"], hasNotWatched);
    },
  });
  return mutation.mutate;
}

export function useDeleteMovies() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (selectedRows: number[]) => {
      const response = await axios.delete("/.netlify/functions/deleteMovie", {
        data: {
          ids: selectedRows,
        },
      });
      const watched = response.data.filter((movie: Movie) => movie.hasWatched);
      const hasNotWatched = response.data.filter(
        (movie: Movie) => !movie.hasWatched
      );

      queryClient.setQueryData(["watched-movies"], watched);
      queryClient.setQueryData(["movies"], hasNotWatched);
    },
  });
  return mutation.mutate;
}

export function useAddMovie() {
  const databaseMovies = useFetchMovies();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (movie: Movie) => {
      if (!movie) {
        console.warn("No valid movie selected.");
        return;
      }

      const movieExists = databaseMovies.some((m: Movie) => m.id === movie.id);
      if (movieExists) {
        console.warn("Movie already exists in your list.");
        return;
      }

      const response = await axios.post("/.netlify/functions/addMovie", movie);
      queryClient.setQueryData(["movies"], response.data);
    },
  });
  return mutation.mutate;
}

export function useAutoComplete() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useRef<HTMLTableRowElement | null>(null);
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteMovie[]>(
    []
  );

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.trim() && !loading) {
        setLoading(true);

        try {
          const response = await axios.get(
            `${API_URL}&api_key=${API_KEY}&query=${query}&page=${page}`
          );

          const moviesData = response.data.results as Movie[];
          const uniqueMovies = Array.from(
            new Map(
              moviesData.map((movie: Movie) => [movie.title, movie])
            ).values()
          );

          setAutocompleteData((prevData) => {
            const mergedData = [
              ...prevData,
              ...uniqueMovies.map((movie: Movie) => ({
                value: movie.title,
                release_date: movie.release_date.split("-")[0],
                id: movie.id,
              })),
            ];

            const uniqueData = Array.from(
              new Map(mergedData.map((item) => [item.value, item])).values()
            );

            return uniqueData;
          });

          setMovies((prevMovies) => [...prevMovies, ...uniqueMovies]);
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const debounceFetch = setTimeout(fetchMovies, 300);
    return () => clearTimeout(debounceFetch);
  }, [query, page, loading]);
  useEffect(() => {
    if (lastMovieRef.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      observer.current.observe(lastMovieRef.current);

      return () => {
        if (observer.current && lastMovieRef.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [loading]);
  return {
    query,
    setQuery,
    movies,
    setMovies,
    autocompleteData,
    lastMovieRef,
    setAutocompleteData,
  };
}
