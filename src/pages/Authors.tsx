import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import FormInput from '@/components/shared/FormInput';
// import FormTextarea from '@/components/shared/FormTextarea'; // Removed unused import
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuthors } from '@/hooks/useAuthors';
import type { Author } from '@/types/api';
import { uploadService } from '@/services/uploadService';
import { useToast } from '@/contexts/ToastContext';
import * as Yup from 'yup';

const authorSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters').max(100).required('Name is required'),
});

interface AuthorFormProps {
    editingAuthor: Author | null;
    handleSubmit: (values: { name: string }) => Promise<void>;
    handleCloseModal: () => void;
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploading: boolean;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
    editingAuthor,
    handleSubmit,
    handleCloseModal,
    imagePreview,
    handleImageChange,
    isUploading,
}) => {
    const formik = useFormik({
        initialValues: {
            name: editingAuthor?.name || '',
        },
        validationSchema: authorSchema,
        onSubmit: handleSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <FormInput
                name="name"
                label="Name"
                placeholder="John Doe"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
            />

            {/* Image Upload */}
            <div>
                <label className="mb-2 block text-sm font-medium">Profile Image</label>
                <div className="space-y-3">
                    {imagePreview && (
                        <div className="relative inline-block">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-32 w-32 rounded-full object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="image-upload"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <FiUpload />
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={isUploading}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" onClick={handleCloseModal} variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={formik.isSubmitting || isUploading}>
                    {formik.isSubmitting ? 'Saving...' : editingAuthor ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
};

const Authors: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        authorId: string | null;
    }>({ isOpen: false, authorId: null });

    // const [currentPage, setCurrentPage] = useState(1); // Removed unused variable
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { authors, loading, pagination, fetchAuthors, createAuthor, updateAuthor, deleteAuthor: deleteAuthorMutation } = useAuthors();
    const { showSuccess, showError } = useToast();

    const handleOpenModal = (author?: Author) => {
        if (author) {
            setEditingAuthor(author);
            setImageUrl(author.image || '');
            setImagePreview(author.image || null);
        } else {
            setEditingAuthor(null);
            setImageUrl('');
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAuthor(null);
        setImageUrl('');
        setImagePreview(null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const url = await uploadService.uploadBlogImage(file);
            setImageUrl(url);
            showSuccess('Upload Successful', 'Image uploaded successfully');
        } catch (error) {
            showError('Upload Failed', 'Failed to upload image. Please try again.');
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            const data = {
                name: values.name,
                image: imageUrl,
            };

            if (editingAuthor) {
                await updateAuthor(editingAuthor._id, data);
                showSuccess('Success', 'Author updated successfully');
            } else {
                await createAuthor(data);
                showSuccess('Success', 'Author created successfully');
            }
            handleCloseModal();
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to save author');
        }
    };

    const handleDeleteClick = (authorId: string) => {
        setDeleteConfirmation({ isOpen: true, authorId });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmation.authorId) return;

        try {
            await deleteAuthorMutation(deleteConfirmation.authorId);
            showSuccess('Success', 'Author deleted successfully');
            setDeleteConfirmation({ isOpen: false, authorId: null });
        } catch (error) {
            showError('Error', 'Failed to delete author');
        }
    };

    const handlePageChange = (page: number) => {
        // setCurrentPage(page); // Removed unused variable
        fetchAuthors(page);
    };

    if (loading && !authors.length) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Authors</h1>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <FiPlus /> Add Author
                </Button>
            </div>

            {/* Authors Table */}
            <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:bg-gray-800">
                <table className="w-full">
                    <thead className="border-b bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {authors.map((author) => (
                            <tr key={author._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4">
                                    {author.image ? (
                                        <img src={author.image} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                            <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                                                {author.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">{author.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleOpenModal(author)}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <FiEdit2 /> Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteClick(author._id)}
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <FiTrash2 /> Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={pagination.page}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                {editingAuthor ? 'Edit Author' : 'Add Author'}
                            </h2>
                            <Button onClick={handleCloseModal} variant="ghost" size="icon">
                                <FiX />
                            </Button>
                        </div>

                        <AuthorForm
                            editingAuthor={editingAuthor}
                            handleSubmit={handleSubmit}
                            handleCloseModal={handleCloseModal}
                            imagePreview={imagePreview}
                            handleImageChange={handleImageChange}
                            isUploading={isUploading}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, authorId: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Author"
                message="Are you sure you want to delete this author? This action cannot be undone."
            />
        </div>
    );
};

export default Authors;

