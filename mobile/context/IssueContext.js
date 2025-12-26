import React, { createContext, useState, useContext } from 'react';
import { issueAPI } from '../utils/api';
import { AuthContext } from './AuthContext';

export const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch issues with optional filters
    const fetchIssues = async (filters = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await issueAPI.getAllIssues(filters);
            setIssues(response.data.issues);
            return { success: true, issues: response.data.issues };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Create new issue
    const createIssue = async (issueData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await issueAPI.createIssue(issueData);
            setIssues([response.data.issue, ...issues]);
            return { success: true, issue: response.data.issue };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Update issue (admin only)
    const updateIssue = async (id, updateData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await issueAPI.updateIssue(id, updateData);

            // Update local state
            setIssues(issues.map(issue =>
                issue._id === id ? response.data.issue : issue
            ));

            return { success: true, issue: response.data.issue };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Delete issue
    const deleteIssue = async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            await issueAPI.deleteIssue(id);

            // Remove from local state
            setIssues(issues.filter(issue => issue._id !== id));

            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Add remarks (admin only)
    const addRemarks = async (id, remarks) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await issueAPI.addRemarks(id, remarks);

            // Update local state
            setIssues(issues.map(issue =>
                issue._id === id ? response.data.issue : issue
            ));

            return { success: true, issue: response.data.issue };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IssueContext.Provider
            value={{
                issues,
                isLoading,
                error,
                fetchIssues,
                createIssue,
                updateIssue,
                deleteIssue,
                addRemarks,
            }}
        >
            {children}
        </IssueContext.Provider>
    );
};
