import { View } from 'react-native';
import * as Typography from '../src/components/Typography/typography';

export default function CameraScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Typography.H2>Tela de Câmera</Typography.H2>
    </View>
  );
}