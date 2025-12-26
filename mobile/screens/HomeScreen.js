import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { IssueContext } from '../context/IssueContext';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const { issues, fetchIssues, isLoading } = useContext(IssueContext);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadMyIssues();
    }, []);

    const loadMyIssues = async () => {
        await fetchIssues({ myIssues: 'true' });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMyIssues();
        setRefreshing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return '#ef4444';
            case 'In Progress':
                return '#f59e0b';
            case 'Resolved':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Electrical':
                return '⚡';
            case 'Water':
                return '💧';
            case 'Internet':
                return '📡';
            case 'Infrastructure':
                return '🏗️';
            default:
                return '📋';
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' },
        ]);
    };

    const renderIssue = ({ item }) => (
        <TouchableOpacity
            style={styles.issueCard}
            onPress={() => navigation.navigate('IssueDetail', { issue: item })}
        >
            <View style={styles.issueHeader}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
                <View style={styles.issueInfo}>
                    <Text style={styles.issueTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.issueCategory}>{item.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.issueDescription} numberOfLines={2}>
                {item.description}
            </Text>
            <Text style={styles.issueDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading && !refreshing && issues.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name}!</Text>
                    <Text style={styles.role}>{user?.role === 'admin' ? 'Admin' : 'Student'}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>My Issues</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreateIssue')}
                >
                    <Text style={styles.createButtonText}>+ New Issue</Text>
                </TouchableOpacity>
            </View>

            {issues.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📋</Text>
                    <Text style={styles.emptyText}>No issues reported yet</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('CreateIssue')}
                    >
                        <Text style={styles.emptyButtonText}>Report Your First Issue</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={issues}
                    renderItem={renderIssue}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#2563eb',
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    role: {
        fontSize: 14,
        color: '#dbeafe',
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: '#1e40af',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    createButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    issueCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    issueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    issueInfo: {
        flex: 1,
    },
    issueTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    issueCategory: {
        fontSize: 12,
        color: '#6b7280',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    issueDescription: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 8,
    },
    issueDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeScreen;
