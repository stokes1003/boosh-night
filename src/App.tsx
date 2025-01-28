import { Stack, Container } from "@mantine/core";
import { Header } from "./components/Header";
import { AutoComplete } from "./components/AutoComplete";
import { MoviesToWatch } from "./components/MoviesToWatch";
import { WatchedMovies } from "./components/WatchedMovies";

export interface Movie {
  title: string;
  release_date: string;
  id: number;
  hasWatched: boolean;
  watchedDate: string;
}

export interface AutocompleteMovie {
  value: string;
  release_date: string;
  id: number;
}

function App() {
  return (
    <Container size="sm" my="xl">
      <Stack gap="xl">
        <Header />
        <AutoComplete />
        <MoviesToWatch />
        <WatchedMovies />
      </Stack>
    </Container>
  );
}

export default App;
