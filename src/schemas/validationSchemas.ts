import * as yup from 'yup';

// Login Schema
export const loginSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Category Schema
export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters'),
  description: yup.string(),
  isActive: yup.boolean(),
  parentCategory: yup.string().nullable(),
});

