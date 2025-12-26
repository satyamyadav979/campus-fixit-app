const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

// @route   POST /api/issues
// @desc    Create a new issue
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, image, priority } = req.body;

        // Validation
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, and category'
            });
        }

        // Create issue
        const issue = await Issue.create({
            title,
            description,
            category,
            image: image || null,
            priority: priority || 'Medium',
            createdBy: req.user._id
        });

        // Populate user details
        await issue.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            issue
        });
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error creating issue'
        });
    }
});

// @route   GET /api/issues
// @desc    Get all issues (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { category, status, myIssues } = req.query;

        // Build filter
        const filter = {};

        // If myIssues is true, only show user's own issues
        if (myIssues === 'true') {
            filter.createdBy = req.user._id;
        }

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const issues = await Issue.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: issues.length,
            issues
        });
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching issues'
        });
    }
});

// @route   GET /api/issues/:id
// @desc    Get single issue by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.status(200).json({
            success: true,
            issue
        });
    } catch (error) {
        console.error('Get issue error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching issue'
        });
    }
});

// @route   PUT /api/issues/:id
// @desc    Update issue status (Admin only)
// @access  Private + Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { status, remarks, priority } = req.body;

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Update fields
        if (status) issue.status = status;
        if (remarks !== undefined) issue.remarks = remarks;
        if (priority) issue.priority = priority;

        await issue.save();
        await issue.populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            issue
        });
    } catch (error) {
        console.error('Update issue error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error updating issue'
        });
    }
});

// @route   DELETE /api/issues/:id
// @desc    Delete issue (Creator or Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Check if user is creator or admin
        if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this issue'
            });
        }

        await issue.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Issue deleted successfully'
        });
    } catch (error) {
        console.error('Delete issue error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error deleting issue'
        });
    }
});

// @route   PUT /api/issues/:id/remarks
// @desc    Add/update remarks on issue (Admin only)
// @access  Private + Admin
router.put('/:id/remarks', auth, adminAuth, async (req, res) => {
    try {
        const { remarks } = req.body;

        if (!remarks) {
            return res.status(400).json({
                success: false,
                message: 'Please provide remarks'
            });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        issue.remarks = remarks;
        await issue.save();
        await issue.populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Remarks added successfully',
            issue
        });
    } catch (error) {
        console.error('Add remarks error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error adding remarks'
        });
    }
});

module.exports = router;
