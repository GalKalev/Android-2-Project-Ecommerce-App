import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { UserProvider } from './utils/UserContext';

import { Provider } from 'react-native-paper';
import store from './utils/store';

export default function App() {
  return (

    <>
      <UserProvider>

        <StackNavigator />

      </UserProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
