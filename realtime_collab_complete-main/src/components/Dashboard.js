import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/api/documents');
            setDocuments(response.data);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setError('Failed to load documents');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchDocuments();
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Welcome Message */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.name || 'User'}!
                </Typography>
                <Typography variant="body1">
                    Here's a quick overview of your activity and tools to get started.
                </Typography>
            </Paper>

            {/* Quick Links */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/document/new')}
                >
                    Create New Document
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/templates')}
                >
                    Browse Templates
                </Button>
            </Box>

            {/* Recent Documents */}
            <Typography variant="h5" gutterBottom>
                Recent Documents
            </Typography>
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <Grid container spacing={3}>
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <Grid item xs={12} sm={6} md={4} key={doc._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{doc.title}</Typography>
                                    <Typography color="textSecondary">
                                        Last modified: {new Date(doc.updatedAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/documents/${doc._id}`)}
                                    >
                                        Open
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No documents found. Start by creating a new document!
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default Dashboard;