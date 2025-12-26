import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateIssueScreen from '../screens/CreateIssueScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import AllIssuesScreen from '../screens/AllIssuesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack for login and register
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
                headerShown: true,
                title: 'Create Account',
                headerTintColor: '#2563eb',
            }}
        />
    </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
                paddingBottom: 8,
                paddingTop: 8,
                height: 60,
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            },
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                headerShown: false,
                tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
                tabBarLabel: 'My Issues',
            }}
        />
        <Tab.Screen
            name="AllIssues"
            component={AllIssuesScreen}
            options={{
                title: 'Browse Issues',
                headerTintColor: '#2563eb',
                headerTitleStyle: { fontWeight: 'bold' },
                tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
                tabBarLabel: 'Browse',
            }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                title: 'My Profile',
                headerTintColor: '#2563eb',
                headerTitleStyle: { fontWeight: 'bold' },
                tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
            }}
        />
    </Tab.Navigator>
);

// Helper component for emoji icons
const TabIcon = ({ emoji, color }) => (
    <Text style={{ fontSize: 24, opacity: color === '#2563eb' ? 1 : 0.5 }}>
        {emoji}
    </Text>
);

// Main App Stack with Create Issue and Issue Detail modals
const AppStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="CreateIssue"
            component={CreateIssueScreen}
            options={{
                title: 'Report Issue',
                headerTintColor: '#2563eb',
                headerTitleStyle: { fontWeight: 'bold' },
                presentation: 'modal',
            }}
        />
        <Stack.Screen
            name="IssueDetail"
            component={IssueDetailScreen}
            options={{
                title: 'Issue Details',
                headerTintColor: '#2563eb',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
    </Stack.Navigator>
);

// Main Navigator
const AppNavigator = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

// Need to import Text from react-native
import { Text } from 'react-native';

export default AppNavigator;
