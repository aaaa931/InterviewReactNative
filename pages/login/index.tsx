import { useContext, useState } from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthContext } from '../../auth/provider';

interface Login {
  identifier: string;
  password: string;
}

export default function LoginScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);

  const initialState: Login = {
    identifier: 'in002',
    password: 'Qvs0ZdTT23xIKXH',
  };

  const [loginData, setLoginData] = useState<Login>(initialState);

  const handleIdentifierChange = (text: string) => {
    setLoginData({ ...loginData, identifier: text });
  };

  const handlePasswordChange = (text: string) => {
    setLoginData({ ...loginData, password: text });
  };

  const handleLogin = async () => {
    await login(loginData.identifier, loginData.password, () => {
      navigation.navigate('Login');
    });
    navigation.navigate('User');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>username</Text>
        <TextInput
          value={initialState.identifier}
          onChangeText={handleIdentifierChange}
          style={styles.input}
        />
      </View>
      <View>
        <Text>password</Text>
        <TextInput
          secureTextEntry
          value={initialState.password}
          onChangeText={handlePasswordChange}
          style={styles.input}
        />
      </View>
      <View>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    width: screenWidth * 0.8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
