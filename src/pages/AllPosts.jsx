import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await appwriteService.getPosts([]);
                if (response && response.documents) {
                    setPosts(response.documents);
                } else {
                    throw new Error('No posts found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className='w-full py-8'><Container>Loading...</Container></div>;
    }

    if (error) {
        return <div className='w-full py-8'><Container>Error: {error}</Container></div>;
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className='w-full py-8'><Container>No posts available</Container></div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default AllPosts;
