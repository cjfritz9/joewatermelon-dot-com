import { Illustration } from "@/components/404Background";
import classes from "@/styles/NotFound.module.css";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import Link from "next/link";

function NotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            The page you are trying to open does not exist.
          </Text>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Most of this website is a WIP and the majority of the content is
            temporary or placeholder.
          </Text>
          <Group justify="center">
            <Link href="/">
              <Button size="md">Take me back home</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;
