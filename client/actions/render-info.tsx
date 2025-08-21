import { Text } from 'react-native';

export default async function myFunc(): Promise<any> {
  'use server';
  return <Text>renderInfo func</Text>;
}