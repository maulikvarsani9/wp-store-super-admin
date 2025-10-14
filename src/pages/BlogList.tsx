import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'; // Removed FiEye
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useBlogs } from '@/hooks/useBlogs';
// import type { Blog } from '@/types/api'; // Removed unused import
import { useToast } from '@/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const BlogList: React.FC = () => {
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        blogId: string | null;
    }>({ isOpen: false, blogId: null });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { blogs, loading, pagination, fetchBlogs, deleteBlog: deleteBlogMutation } = useBlogs();
    const { showSuccess, showError } = useToast();

    const handleDeleteClick = (blogId: string) => {
        setDeleteConfirmation({ isOpen: true, blogId });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmation.blogId) return;

        try {
            await deleteBlogMutation(deleteConfirmation.blogId);
            showSuccess('Success', 'Blog deleted successfully');
            setDeleteConfirmation({ isOpen: false, blogId: null });
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to delete blog');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, blogId: null });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchBlogs(page, searchQuery);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs(1, searchQuery);
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-600">Manage your blog posts</p>
                </div>
                <Button
                    onClick={() => navigate('/blogs/add')}
                    className="bg-primary hover:bg-primary/90"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Blog Post
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                            Search
                        </Button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" text="Loading blogs..." />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No blog posts found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Blog Post
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img
                                                        className="h-16 w-16 rounded object-cover"
                                                        src={blog.mainImage}
                                                        alt={blog.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/64';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {truncateText(blog.title, 60)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {truncateText(stripHtml(blog.content), 80)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {typeof blog.author === 'object' && blog.author.image && (
                                                    <img
                                                        className="h-8 w-8 rounded-full mr-2"
                                                        src={blog.author.image}
                                                        alt={blog.author.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/32';
                                                        }}
                                                    />
                                                )}
                                                <span className="text-sm text-gray-900">
                                                    {typeof blog.author === 'object' ? blog.author.name : 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(blog.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(blog._id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && blogs.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={(count) => {
                                // Handle items per page change if needed
                                console.log('Items per page changed to:', count);
                            }}
                        />
                    </div>
                )}
            </div>

            <DeleteConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
                title="Delete Blog Post"
                message="Are you sure you want to delete this blog post? This action cannot be undone."
            />
        </div>
    );
};

export default BlogList;



