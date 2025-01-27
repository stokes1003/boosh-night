import {
  Stack,
  Text,
  Container,
  Table,
  Autocomplete,
  Button,
  Group,
 
} from '@mantine/core';

import { useState } from 'react';
import { useAddMovie, useDeleteMovies, useFetchMovies } from './hooks';
import { useAutoComplete } from './hooks';
import { useMediaQuery } from '@mantine/hooks';
import { Header } from './components/Header';

export interface Movie {
  title: string;
  release_date: string;
  id: number;
}

export interface AutocompleteMovie {
  value: string;
  release_date: string;
  id: number;
}

function App() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const databaseMovies = useFetchMovies();
  const { movies, query, setQuery, autocompleteData, setAutocompleteData } =
    useAutoComplete();
  const handleDelete = useDeleteMovies();
  const handleAddMovie = useAddMovie();
  const matches = useMediaQuery('(min-width: 540px)');
  const handleCheckbox = (movieId: number) => {
    setSelectedRows(
      !selectedRows.includes(movieId)
        ? [...selectedRows, movieId]
        : selectedRows.filter((id) => id !== movieId)
    );
  };


  const rows = databaseMovies?.map((movie: Movie) => (
    <Table.Tr
      key={movie.id}
      bg={
        selectedRows.includes(movie.id)
          ? 'var(--mantine-color-blue-light)'
          : undefined
      }
      onClick={() => handleCheckbox(movie.id)}
    >
      <Table.Td>{movie.title}</Table.Td>
      <Table.Td>{movie.release_date?.split('-')[0] || 'N/A'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="sm" mt="lg">
      <Stack align="center" justify="center" gap="xl" my="md">
       <Header />
        <Stack gap="sm" align={matches ? 'left' : 'center'}>
          <Text size="lg" fw={600}>
            Search for Movies to Add
          </Text>
          <Group justify='center'>
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
                setQuery('');
                setAutocompleteData([]);
              }}
            >
              Add Movie
            </Button>
          </Group>
        </Stack>
        <Stack align="center">
          <Stack gap="sm" align="center">
            <Text size="lg" fw={600}>
              Movies To Watch
            </Text>
          </Stack>
        
          <Table.ScrollContainer minWidth={matches ? 500 : 300}>
            <Table withTableBorder verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Movie Name</Table.Th>
                  <th>Year</th>
                </Table.Tr>
              </Table.Thead>
              <tbody>{rows}</tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
        {selectedRows.length > 0 && (
          <Button
            onClick={async () => {
              await handleDelete(selectedRows);
              setSelectedRows([]);
            }}
          >
            Delete Movie
          </Button>
        )}
      </Stack>
    </Container>
  );
}

export default App;
