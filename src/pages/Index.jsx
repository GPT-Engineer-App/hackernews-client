import { Box, Button, Container, Heading, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopStories = async () => {
    setIsLoading(true);
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
    const storyIds = await response.json();
    const topStoryIds = storyIds.slice(0, 15);

    const storyPromises = topStoryIds.map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then(res => res.json())
    );

    const stories = await Promise.all(storyPromises);
    setStories(stories);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopStories();
  }, []);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">Top HackerNews Stories</Heading>
        <Button onClick={fetchTopStories} isLoading={isLoading} loadingText="Refreshing...">
          Refresh Stories
        </Button>
        <List spacing={3} width="full">
          {stories.map(story => (
            <ListItem key={story.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
              <Text fontSize="sm">By {story.by}</Text>
              <Text fontSize="sm">{new Date(story.time * 1000).toLocaleDateString()}</Text>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;