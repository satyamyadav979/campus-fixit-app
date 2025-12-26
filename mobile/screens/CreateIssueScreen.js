import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IssueContext } from '../context/IssueContext';

const CATEGORIES = ['Electrical', 'Water', 'Internet', 'Infrastructure'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const CreateIssueScreen = ({ navigation }) => {
    const { createIssue } = useContext(IssueContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Electrical');
    const [priority, setPriority] = useState('Medium');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5, // Reduce quality to decrease size
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error(error);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleSubmit = async () => {
        // Validation
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }

        setIsLoading(true);

        // Prepare issue data
        const issueData = {
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            image: image ? `data:image/jpeg;base64,${image.base64}` : null,
        };

        const result = await createIssue(issueData);
        setIsLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Issue reported successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Error', result.error || 'Failed to create issue');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Report New Issue</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Brief title of the issue"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe the issue in detail"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Category *</Text>
                    <View style={styles.categoryContainer}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    category === cat && styles.categoryButtonActive,
                                ]}
                                onPress={() => setCategory(cat)}
                                disabled={isLoading}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        category === cat && styles.categoryTextActive,
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.priorityContainer}>
                        {PRIORITIES.map((pri) => (
                            <TouchableOpacity
                                key={pri}
                                style={[
                                    styles.priorityButton,
                                    priority === pri && styles.priorityButtonActive,
                                ]}
                                onPress={() => setPriority(pri)}
                                disabled={isLoading}
                            >
                                <Text
                                    style={[
                                        styles.priorityText,
                                        priority === pri && styles.priorityTextActive,
                                    ]}
                                >
                                    {pri}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Photo (Optional)</Text>
                    {image ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: image.uri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removeImage}
                                disabled={isLoading}
                            >
                                <Text style={styles.removeImageText}>✕ Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={pickImage}
                            disabled={isLoading}
                        >
                            <Text style={styles.imagePickerText}>📷 Pick an Image</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Issue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    categoryButtonActive: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    categoryText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    priorityButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    priorityText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    priorityTextActive: {
        color: '#fff',
    },
    imagePickerButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    imagePickerText: {
        fontSize: 16,
        color: '#6b7280',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    removeImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreateIssueScreen;
