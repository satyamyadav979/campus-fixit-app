import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <IssueProvider>
                <AppNavigator />
                <StatusBar style="auto" />
            </IssueProvider>
        </AuthProvider>
    );
}
