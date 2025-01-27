import {
  Stack,
  Container,
} from '@mantine/core';
import { Header } from './components/Header';
import { AutoComplete } from './components/AutoComplete';
import { MoviesToWatch } from './components/MoviesToWatch';

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
  return (
    <Container size="sm" mt="lg">
      <Stack align="center" justify="center" gap="xl" my="md">
       <Header />
       <AutoComplete />
       <MoviesToWatch />
  
      </Stack>
    </Container>
  );
}

export default App;
