import { StyleSheet } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { UserProvider } from './utils/UserContext';
import Toast, { BaseToast } from 'react-native-toast-message';


export default function App() {
  return (

    <>
      <UserProvider>

        <StackNavigator />
        <Toast
          config={{
            info: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: 'black', backgroundColor: 'black' }}
                text1Style={{ fontSize: 15, color: 'white' }}
                text2Style={{ fontSize: 15, color: 'white' }}
              />
            ),
          }}
          position="bottom"
        />

      </UserProvider>
    </>
  );
}

