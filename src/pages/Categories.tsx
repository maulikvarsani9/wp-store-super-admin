import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiUpload } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Formik, Form } from 'formik';
import FormInput from '@/components/shared/FormInput';
import FormTextarea from '@/components/shared/FormTextarea';
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/hooks/useCategories';
import { categorySchema } from '@/schemas/validationSchemas';
import type { Category } from '@/types/api';
import { uploadService } from '@/services/uploadService';
import { useToast } from '@/contexts/ToastContext';

const Categories: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        categoryId: string | null;
    }>({ isOpen: false, categoryId: null });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Main image states
    const [mainImageUrl, setMainImageUrl] = useState<string>('');
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

    // Additional images states
    const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);

    const [isUploading, setIsUploading] = useState(false);

    const { data, isLoading } = useCategories({
        page: currentPage,
        limit: itemsPerPage,
    });
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();
    const { showError } = useToast();

    // Debug: Log pagination data
    console.log('Categories data:', data);

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setMainImageUrl(category.image || '');
            setMainImagePreview(category.image || null);
            setAdditionalImageUrls(category.additionalImages || []);
            setAdditionalImagesPreview(category.additionalImages || []);
        } else {
            setEditingCategory(null);
            setMainImageUrl('');
            setMainImagePreview(null);
            setAdditionalImageUrls([]);
            setAdditionalImagesPreview([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setMainImageUrl('');
        setMainImagePreview(null);
        setAdditionalImageUrls([]);
        setAdditionalImagesPreview([]);
    };

    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setMainImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload immediately
        setIsUploading(true);
        try {
            const { url } = await uploadService.uploadSingleImage(file);
            setMainImageUrl(url);
        } catch (error) {
            showError('Upload Failed', 'Failed to upload main image. Please try again.');
            setMainImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Show previews immediately
        const previews: string[] = [];
        for (const file of files) {
            const reader = new FileReader();
            const preview = await new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            previews.push(preview);
        }
        setAdditionalImagesPreview(prev => [...prev, ...previews]);

        // Upload immediately
        setIsUploading(true);
        try {
            const { urls } = await uploadService.uploadMultipleImages(files);
            setAdditionalImageUrls(prev => [...prev, ...urls]);
        } catch (error) {
            showError('Upload Failed', 'Failed to upload additional images. Please try again.');
            // Remove the previews that failed to upload
            setAdditionalImagesPreview(prev => prev.slice(0, -(files.length)));
        } finally {
            setIsUploading(false);
        }
    };

    const removeMainImage = () => {
        setMainImageUrl('');
        setMainImagePreview(null);
    };

    const removeAdditionalImage = (index: number) => {
        setAdditionalImagesPreview(prev => prev.filter((_, i) => i !== index));
        setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (
        values: { name: string; description: string; isActive: boolean },
        { setSubmitting, resetForm }: {
            setSubmitting: (isSubmitting: boolean) => void;
            resetForm: () => void;
        }
    ) => {
        try {
            // Use the already uploaded image URLs
            const categoryData = {
                ...values,
                image: mainImageUrl,
                additionalImages: additionalImageUrls,
            };

            if (editingCategory) {
                await updateCategory.mutateAsync({
                    id: editingCategory._id,
                    data: categoryData,
                });
            } else {
                await createCategory.mutateAsync(categoryData);
            }

            resetForm();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (categoryId: string) => {
        setDeleteConfirmation({ isOpen: true, categoryId });
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmation.categoryId) {
            await deleteCategory.mutateAsync(deleteConfirmation.categoryId);
            setDeleteConfirmation({ isOpen: false, categoryId: null });
        }
    };

    const initialValues = {
        name: editingCategory?.name || '',
        description: editingCategory?.description || '',
        isActive: editingCategory?.isActive ?? true,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" text="Loading categories..." />
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your product categories
                        </p>
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-[#ff6b00] hover:bg-[#ff6b00]/90"
                    >
                        <FiPlus className="mr-2" />
                        Add Category
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.categories && data.categories.length > 0 ? (
                                data.categories.map((category: Category) => (
                                    <tr key={category._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FiImage className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {category.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-md truncate">
                                                {category.description || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenModal(category)}
                                                className="mr-2"
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteClick(category._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <p className="text-gray-500">
                                            No categories found. Create your first category to get
                                            started.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.pagination && data.categories.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data.pagination.totalPages}
                        totalItems={data.pagination.totalCategories}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(count) => {
                            setItemsPerPage(count);
                            setCurrentPage(1); // Reset to first page when changing items per page
                        }}
                    />
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={categorySchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="space-y-4">
                                    <FormInput
                                        label="Category Name"
                                        name="name"
                                        required
                                        placeholder="Enter category name"
                                    />

                                    <FormTextarea
                                        label="Description"
                                        name="description"
                                        placeholder="Enter category description"
                                        rows={4}
                                    />

                                    {/* Category Images Section */}
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-4">Category Images</h3>

                                        {/* Main Image */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Main Image <span className="text-red-500">*</span>
                                            </label>

                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleMainImageChange}
                                                    className="hidden"
                                                    id="mainImage"
                                                />
                                                <label
                                                    htmlFor="mainImage"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <FiUpload className="w-4 h-4" />
                                                    <span>Upload Main Image</span>
                                                </label>
                                                {mainImagePreview && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={mainImagePreview}
                                                            alt="Main preview"
                                                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        {mainImageUrl ? (
                                                            <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                                ✓ Uploaded
                                                            </span>
                                                        ) : (
                                                            <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                                                                Uploading...
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={removeMainImage}
                                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional Images */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Images (Max 5)
                                            </label>

                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleAdditionalImagesChange}
                                                    className="hidden"
                                                    id="additionalImages"
                                                />
                                                <label
                                                    htmlFor="additionalImages"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <FiPlus className="w-4 h-4" />
                                                    <span>Add Images</span>
                                                </label>

                                                {additionalImagesPreview.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                                        {additionalImagesPreview.map((image, index) => {
                                                            const hasUrl = additionalImageUrls[index];

                                                            return (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={image}
                                                                        alt={`Additional ${index + 1}`}
                                                                        className="h-24 w-full object-cover rounded-lg border-2 border-gray-200"
                                                                    />
                                                                    {hasUrl ? (
                                                                        <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                                            ✓ Uploaded
                                                                        </span>
                                                                    ) : (
                                                                        <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                                                                            Uploading...
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAdditionalImage(index)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                                    >
                                                                        <FiX className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={values.isActive}
                                            onChange={e =>
                                                setFieldValue('isActive', e.target.checked)
                                            }
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="isActive"
                                            className="ml-2 block text-sm text-gray-900"
                                        >
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex gap-3 justify-end pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting || isUploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#ff6b00] hover:bg-[#ff6b00]/90"
                                            disabled={isSubmitting || isUploading}
                                        >
                                            {isUploading
                                                ? 'Uploading...'
                                                : isSubmitting
                                                    ? 'Saving...'
                                                    : editingCategory
                                                        ? 'Update'
                                                        : 'Create'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() =>
                    setDeleteConfirmation({ isOpen: false, categoryId: null })
                }
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                isDeleting={deleteCategory.isPending}
            />
        </div>
    );
};

export default Categories;

