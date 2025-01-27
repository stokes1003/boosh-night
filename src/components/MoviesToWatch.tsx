import { Stack, Text, Table, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDeleteMovies, useFetchMovies } from "../hooks";
import { useState } from "react";
import { Movie } from "../App";

export const MoviesToWatch = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const matches = useMediaQuery("(min-width: 540px)");
  const databaseMovies = useFetchMovies();
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
      <Table.Td>{movie.title}</Table.Td>
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
    </>
  );
};
