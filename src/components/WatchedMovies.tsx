import { Stack, Text, Table, Button, Group, Modal } from "@mantine/core";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Movie } from "../App";
import { useFetchWatchedMovies, useDeleteMovies, useHasRated } from "../hooks";
import { FaSort } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { CharacterRating } from "react-char-fill";
import { FaStar } from "react-icons/fa";

export const WatchedMovies = () => {
  const matches = useMediaQuery("(min-width: 540px)");
  const watchedMovies = useFetchWatchedMovies();
  const [datesSorted, setDatesSorted] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteOpened, deleteHandler] = useDisclosure(false);
  const [ratingOpened, ratingHandler] = useDisclosure(false);
  const [currentRating, setCurrentRating] = useState(0.5);
  const [interactive] = useState(true);
  const handleRated = useHasRated();
  const [rating, setRating] = useState(2.75);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const calculateRating = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    currentRating: number
  ) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    let x: number;

    if ("clientX" in event) {
      x = event.clientX - rect.left;
    } else {
      x = (currentRating / 5) * rect.width;
    }

    const width = rect.width;
    let newRating = (x / width) * 5;

    newRating = Math.round(newRating / 0.5) * 0.5;
    newRating = Math.max(newRating, 1);
    return newRating;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isSubmitting) return;
    const newRating = calculateRating(event, currentRating);
    setRating(Math.max(newRating, 1));
    setCurrentRating(Math.max(newRating, 1));
    setIsSubmitting(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const newRating = calculateRating(event, currentRating);
    setCurrentRating(newRating);
  };
  const handleDeleteMovieButton = () => {
    ratingHandler.close();
    deleteHandler.open();
  };
  const handleClickOnMovie = (movie: Movie) => {
    ratingHandler.open();
    setSelectedRows([movie.id]);
  };

  const handleRatingSubmit = (
    selectedRows: number[],
    currentRating: number
  ) => {
    ratingHandler.close();
    handleRated({ selectedRows, currentRating });
  };

  const rows = sortedDates?.map((movie: Movie) => (
    <Table.Tr
      key={movie.id}
      bg={
        selectedRows.includes(movie.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
      onClick={() => handleClickOnMovie(movie)}
    >
      <Table.Td>
        {matches
          ? movie.title
          : movie.title.length > 35
          ? `${movie.title.slice(0, 35)}...`
          : movie.title}
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {Array.isArray(movie.hasRated) && movie.hasRated.length > 0
            ? (
                movie.hasRated.map(Number).reduce((a, b) => a + b, 0) /
                movie.hasRated.length
              ).toFixed(1)
            : "N/A"}{" "}
          <FaStar color="gold" />
        </Group>
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
              <Table.Th>Rating</Table.Th>
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
      <Modal
        opened={ratingOpened}
        onClose={ratingHandler.close}
        title="Rate Movie"
      >
        <Stack align="center" gap="xl">
          <CharacterRating
            rating={currentRating}
            character="★"
            maxRating={5}
            emptyColor="lightgray"
            fontSize="50px"
            fillColor="gold"
            step={0.5}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          />
          <Group gap="xl" justify="center">
            <Button
              w={150}
              onClick={() => handleRatingSubmit(selectedRows, currentRating)}
            >
              Submit Rating
            </Button>
            <Button w={150} variant="light" onClick={handleDeleteMovieButton}>
              Delete Movie
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={deleteOpened}
        onClose={deleteHandler.close}
        title="Confirm Delete"
      >
        <Stack align="center">
          <Text>Are you sure you want to delete this movie?</Text>
          <Group gap="xl" justify="center">
            <Button
              onClick={async () => {
                await handleDelete(selectedRows);
                setSelectedRows([]);
                deleteHandler.close();
              }}
            >
              Delete Movie
            </Button>
            <Button onClick={deleteHandler.close} variant="light">
              Cancel Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
