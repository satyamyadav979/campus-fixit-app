import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { IssueContext } from '../context/IssueContext';

const IssueDetailScreen = ({ route, navigation }) => {
    const { issue: initialIssue } = route.params;
    const { user } = useContext(AuthContext);
    const { updateIssue, addRemarks, deleteIssue } = useContext(IssueContext);

    const [issue, setIssue] = useState(initialIssue);
    const [newStatus, setNewStatus] = useState(issue.status);
    const [remarks, setRemarks] = useState(issue.remarks || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isCreator = user?.id === issue.createdBy._id || user?.id === issue.createdBy;

    const statusOptions = ['Open', 'In Progress', 'Resolved'];

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

    const handleUpdateStatus = async () => {
        if (newStatus === issue.status && remarks === issue.remarks) {
            Alert.alert('No Changes', 'Please make changes before updating');
            return;
        }

        setIsUpdating(true);
        const result = await updateIssue(issue._id, {
            status: newStatus,
            remarks,
        });
        setIsUpdating(false);

        if (result.success) {
            setIssue(result.issue);
            Alert.alert('Success', 'Issue updated successfully');
        } else {
            Alert.alert('Error', result.error || 'Failed to update issue');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Issue',
            'Are you sure you want to delete this issue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteIssue(issue._id);
                        if (result.success) {
                            navigation.goBack();
                        } else {
                            Alert.alert('Error', result.error || 'Failed to delete issue');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(issue.category)}</Text>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{issue.title}</Text>
                    <Text style={styles.category}>{issue.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
                    <Text style={styles.statusText}>{issue.status}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{issue.description}</Text>
            </View>

            {issue.image && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Photo</Text>
                    <Image source={{ uri: issue.image }} style={styles.image} />
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Priority:</Text>
                    <Text style={styles.detailValue}>{issue.priority || 'Medium'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reported by:</Text>
                    <Text style={styles.detailValue}>
                        {issue.createdBy?.name || 'Unknown'}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(issue.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
            </View>

            {isAdmin && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Controls</Text>

                    <Text style={styles.label}>Update Status</Text>
                    <View style={styles.statusOptions}>
                        {statusOptions.map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusOption,
                                    newStatus === status && styles.statusOptionActive,
                                    { borderColor: getStatusColor(status) },
                                ]}
                                onPress={() => setNewStatus(status)}
                            >
                                <Text
                                    style={[
                                        styles.statusOptionText,
                                        newStatus === status && { color: getStatusColor(status) },
                                    ]}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Remarks</Text>
                    <TextInput
                        style={styles.remarksInput}
                        placeholder="Add remarks or updates"
                        value={remarks}
                        onChangeText={setRemarks}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
                        onPress={handleUpdateStatus}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.updateButtonText}>Update Issue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {issue.remarks && !isAdmin && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Remarks</Text>
                    <View style={styles.remarksBox}>
                        <Text style={styles.remarksText}>{issue.remarks}</Text>
                    </View>
                </View>
            )}

            {(isAdmin || isCreator) && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>🗑️ Delete Issue</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    categoryIcon: {
        fontSize: 40,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
        color: '#6b7280',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 22,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6b7280',
        width: 120,
    },
    detailValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
        marginTop: 12,
    },
    statusOptions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statusOption: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    statusOptionActive: {
        backgroundColor: '#f9fafb',
    },
    statusOptionText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    remarksInput: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 80,
    },
    remarksBox: {
        backgroundColor: '#fef3c7',
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        borderRadius: 8,
        padding: 12,
    },
    remarksText: {
        fontSize: 14,
        color: '#78350f',
        lineHeight: 20,
    },
    updateButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    updateButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ef4444',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    deleteButtonText: {
        color: '#ef4444',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default IssueDetailScreen;
