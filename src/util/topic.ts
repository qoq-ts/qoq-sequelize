import { Topic } from 'topic';

export const topic = new Topic<{
  modelsInitialized: () => void;
}>();
