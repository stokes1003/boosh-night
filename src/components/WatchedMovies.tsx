import { Stack, Text, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { WatchedMovie } from "../App";
import { useFetchWatchedMovies } from "../hooks";

export const WatchedMovies = () => {
  const matches = useMediaQuery("(min-width: 540px)");
  const watchedMovies = useFetchWatchedMovies();

  const rows = watchedMovies?.map((movie: WatchedMovie) => (
    <Table.Tr key={movie.id}>
      <Table.Td>
        {matches
          ? movie.title
          : movie.title.length > 35
          ? `${movie.title.slice(0, 35)}...`
          : movie.title}
      </Table.Td>
      <Table.Td>{new Date().toLocaleDateString()}</Table.Td>
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
              <Table.Th>Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
};
