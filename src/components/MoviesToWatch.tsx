import { Stack, Text, Table, Button, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDeleteMovies, useFetchMovies, useHasWatched } from "../hooks";
import { useState } from "react";
import { Movie } from "../App";

export const MoviesToWatch = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const matches = useMediaQuery("(min-width: 540px)");
  const databaseMovies = useFetchMovies();
  const handleWatched = useHasWatched();
  const handleDelete = useDeleteMovies();
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
      <Table.Td>{movie.vote_average}</Table.Td>
      <Table.Td>{movie.release_date?.split("-")[0] || "N/A"}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack align="center">
        <Stack gap="sm" align="center">
          <Text size="lg" fw={600}>
            Movies To Watch
          </Text>
        </Stack>

        <Table.ScrollContainer minWidth={matches ? 500 : 330}>
          <Table withTableBorder highlightOnHover verticalSpacing="sm" w="100%">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Movie Name</Table.Th>
                <Table.Th>Rating</Table.Th>
                <Table.Th>Year</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
      {selectedRows.length > 0 && (
        <Group gap="xl" justify="center">
          <Button
            w={150}
            onClick={async () => {
              await handleWatched(selectedRows);
              setSelectedRows([]);
            }}
          >
            Add To Watched
          </Button>
          <Button
            w={150}
            variant="light"
            onClick={async () => {
              await handleDelete(selectedRows);
              setSelectedRows([]);
            }}
          >
            Delete Movie
          </Button>
        </Group>
      )}
    </>
  );
};
