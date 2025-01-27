import { Center, Group, Image, Stack, Title, Text } from "@mantine/core";
import booshFace from "../assets/images/Boosh.png";

export const Header = () => {
  return (
    <Center>
      <Group gap="xl">
        <Image radius={100} src={booshFace} h={100} w={100} />
        <Stack gap="xs">
          <Title>Boosh Night</Title>
          <Text fs="italic">'The Tuesday Night Tradition'</Text>
        </Stack>
      </Group>
    </Center>
  );
};
