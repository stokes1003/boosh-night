import { Stack, Text, Table, Button, Group } from "@mantine/core";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Movie } from "../App";
import { useFetchWatchedMovies, useDeleteMovies } from "../hooks";
import { FaSort } from "react-icons/fa";

export const WatchedMovies = () => {
  const matches = useMediaQuery("(min-width: 540px)");
  const watchedMovies = useFetchWatchedMovies();
  const [datesSorted, setDatesSorted] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleDelete = useDeleteMovies();
  const handleCheckbox = (movieId: number) => {
    setSelectedRows(
      !selectedRows.includes(movieId)
        ? [...selectedRows, movieId]
        : selectedRows.filter((id) => id !== movieId)
    );
  };

  const handleDateSort = () => {
    setDatesSorted(!datesSorted);
  };

  const sortedDates = (
    Array.isArray(watchedMovies) ? [...watchedMovies] : []
  ).sort((a: Movie, b: Movie) =>
    datesSorted
      ? new Date(a.watchedDate).getTime() - new Date(b.watchedDate).getTime()
      : new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime()
  );

  const rows = sortedDates?.map((movie: Movie) => (
    <Table.Tr
      key={movie.id}
      bg={
        selectedRows.includes(movie.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
      onClick={() => handleCheckbox(movie.id)}
    >
      <Table.Td>
        {matches
          ? movie.title
          : movie.title.length > 35
          ? `${movie.title.slice(0, 35)}...`
          : movie.title}
      </Table.Td>
      <Table.Td>{movie.watchedDate}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack align="center">
      <Stack gap="sm" align="center">
        <Text size="lg" fw={600}>
          Watched Movies
        </Text>
      </Stack>

      <Table.ScrollContainer minWidth={matches ? 500 : 330}>
        <Table withTableBorder highlightOnHover verticalSpacing="sm" w="100%">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Movie Name</Table.Th>
              <Table.Th onClick={handleDateSort}>
                <Group gap="xs">
                  Date <FaSort />
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {selectedRows.length > 0 && (
        <Button
          w={150}
          onClick={async () => {
            await handleDelete(selectedRows);
            setSelectedRows([]);
          }}
        >
          Delete Movie
        </Button>
      )}
    </Stack>
  );
};
