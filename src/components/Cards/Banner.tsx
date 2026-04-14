import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Typography from '../Typography/typography';
import { useRouter } from 'expo-router';

export default function Banner() {
  const router = useRouter();
  
  return (
<View style={styles.container}>
      <LinearGradient
        colors={['#2D5240', '#1A4632CC']} // #1A4632 80% de opacidade
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Typography.H4 style={{ color: '#FFF' }}>Devolva à terra</Typography.H4>
          <Typography.Body2 style={{ color: '#E5E7EB', marginTop: 4, marginBottom: 16 }}>
            Recicle itens que você não usa.
          </Typography.Body2>
          
          <TouchableOpacity style={styles.button}>
            <Typography.Body3 style={{ fontWeight: '700', color: '#1A4632' }}>
                Começar
            </Typography.Body3>
          </TouchableOpacity>
        </View>

        {/* Detalhe do ícone de coração no fundo (conforme wireframe) */}
        <View style={styles.iconOverlay}>
           {/* Se tiver o SVG do coração, coloque aqui. Se não, apenas o layout basta */}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    marginVertical: 20,
    width: '100%',
  },
  gradient: {
    borderRadius: 32,
    padding: 24,     
    minHeight: 128,  
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    zIndex: 2,
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  iconOverlay: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.2,
  }
});