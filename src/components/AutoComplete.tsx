import { Stack, Text, Group, Autocomplete, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useAutoComplete, useAddMovie } from "../hooks";

export const AutoComplete = () => {
  const matches = useMediaQuery("(min-width: 540px)");
  const { movies, query, setQuery, autocompleteData, setAutocompleteData } =
    useAutoComplete();
  const handleAddMovie = useAddMovie();

  return (
    <Stack gap="sm" align="center">
      <Text size="lg" fw={600}>
        Search for Movies to Add
      </Text>
      <Group justify="center">
        <Autocomplete
          placeholder="Search Movies"
          w={330}
          data={autocompleteData.map((movie) => movie.value) || []}
          value={query}
          limit={3}
          onChange={(value) => setQuery(value)}
        />
        <Button
          w={matches ? 150 : 330}
          onClick={async () => {
            const movie = movies.find((m) => m.title === query);
            await handleAddMovie(movie!);
            setQuery("");
            setAutocompleteData([]);
          }}
        >
          Add Movie
        </Button>
      </Group>
    </Stack>
  );
};
