import { Stack, Container, Table, Text } from "@mantine/core";
import { Header } from "./components/Header";
import { AutoComplete } from "./components/AutoComplete";
import { MoviesToWatch } from "./components/MoviesToWatch";
import { useMediaQuery } from "@mantine/hooks";
import { useFetchWatchedMovies } from "./hooks";

export interface Movie {
  title: string;
  release_date: string;
  id: number;
  hasWatched: boolean;
}

export interface WatchedMovie {
  title: string;
  watched_date: string;
  id: number;
}

export interface AutocompleteMovie {
  value: string;
  release_date: string;
  id: number;
}

function App() {
  const matches = useMediaQuery("(min-width: 540px)");
  const watchedMovies = useFetchWatchedMovies();
  const rows = watchedMovies?.map((movie: WatchedMovie) => (
    <Table.Tr key={movie.id}>
      <Table.Td>{movie.title}</Table.Td>
      <Table.Td>{new Date().toLocaleDateString()}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Container size="sm" mt="lg">
      <Stack align="center" justify="center" gap="xl" my="md">
        <Header />
        <AutoComplete />
        <MoviesToWatch />
        <Stack align="center">
          <Stack gap="sm" align="center">
            <Text size="lg" fw={600}>
              Watched Movies
            </Text>
          </Stack>

          <Table.ScrollContainer minWidth={matches ? 500 : 300}>
            <Table withTableBorder verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Movie Name</Table.Th>
                  <Table.Th>Date Watched</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
