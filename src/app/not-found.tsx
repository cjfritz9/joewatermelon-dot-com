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
            The page you are trying to open does not exist. If you were linked
            here, this may be a future addition.
          </Text>
          <Group justify="center">
            <Link href="/">
              <Button size="md">Take me back to home page</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;
