import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

import HomeIcon from '../../src/assets/imagens/icons/home.svg';
import SearchIcon from '../../src/assets/imagens/icons/search.svg';
import ChatIcon from '../../src/assets/imagens/icons/chat.svg';
import ProfileIcon from '../../src/imagens/assets/icons/profile.svg';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon height={24} fill={color} />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{  
          title: 'Explorar',
          tabBarIcon: ({ color }) => <SearchIcon height={24} fill={color} />,
        }}
      />
      
      
      <Tabs.Screen
        name="publish"
        options={{
          title: '',
          tabBarButton: (props: any) => {
            const { style, onPress, activeOpacity, children } = props;
      
            return (
            <TouchableOpacity 
            onPress={onPress}
            activeOpacity={activeOpacity || 0.8}
            style={[style, styles.customFabContainer]}
            >
            <View style={styles.customFab}>
                <AntDesign name="plus" size={30} color="#FFF" />
            </View>
            </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <View>
              <ChatIcon height={24} fill={color} />
              <View style={styles.badge} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon height={24} fill={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    shadowOpacity: 0,   
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  customFabContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#19E65E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#19E65E',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
});