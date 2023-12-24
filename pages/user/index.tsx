import { useContext } from 'react';
import { View, Image, Text, Button } from 'react-native';
import { AuthContext } from '../../auth/provider';
import { HOST_API } from '../../utils/config';

export default function UserScreen({ navigation }: any) {
  const auth = useContext(AuthContext);
  const { user, logout } = auth;

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View
      style={{
        padding: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={{
          uri: `${HOST_API}${user?.photoURL.url}`,
        }}
        style={{
          width: 128,
          height: 128,
        }}
      />
      <Text style={{ fontSize: 20 }}>{user?.displayName}</Text>
      <Text style={{ marginBottom: 20 }}>{user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
