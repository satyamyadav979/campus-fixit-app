import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { IssueContext } from '../context/IssueContext';

const CATEGORIES = ['All', 'Electrical', 'Water', 'Internet', 'Infrastructure'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

const AllIssuesScreen = ({ navigation }) => {
    const { issues, fetchIssues, isLoading } = useContext(IssueContext);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadIssues();
    }, [selectedCategory, selectedStatus]);

    const loadIssues = async () => {
        const filters = {};
        if (selectedCategory !== 'All') filters.category = selectedCategory;
        if (selectedStatus !== 'All') filters.status = selectedStatus;
        await fetchIssues(filters);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadIssues();
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
                    <Text style={styles.reportedBy}>
                        By: {item.createdBy?.name || 'Unknown'}
                    </Text>
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
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.filterButton,
                                selectedCategory === cat && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedCategory === cat && styles.filterTextActive,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.filterTitle}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STATUSES.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                selectedStatus === status && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedStatus(status)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedStatus === status && styles.filterTextActive,
                                ]}
                            >
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'} Found
                </Text>
            </View>

            {issues.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>No issues found</Text>
                    <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
    filterSection: {
        backgroundColor: '#fff',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
        marginTop: 8,
    },
    filterButton: {
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    filterButtonActive: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    filterText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    resultsCount: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    listContent: {
        padding: 20,
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
    reportedBy: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
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
        fontWeight: '500',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
    },
});

export default AllIssuesScreen;
