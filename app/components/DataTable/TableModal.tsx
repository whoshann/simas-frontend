import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'tel' | 'email' | 'textarea' | 'file';
    required?: boolean;
    options?: { value: string; label: string }[];
    colSpan?: number;
    placeholder?: string;
    accept?: string;
    dateFormat?: string;
    showMonthYearPicker?: boolean;
}

interface FormData {
    [key: string]: any;
}

interface DynamicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void> | void;
    title: string;
    fields: FieldConfig[];
    initialData?: FormData;
    width?: string;
    children?: React.ReactNode;
}

export default function DynamicModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    fields,
    initialData,
    width = 'w-[40rem]',
    children
}: DynamicModalProps) {
    const [formData, setFormData] = useState<FormData>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({});
            setImagePreview(null);
        }
    }, [isOpen]);

    // Initialize form data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.photo) {
                setImagePreview(initialData.photo);
            }
        } else {
            const defaultData: FormData = {};
            fields.forEach(field => {
                defaultData[field.name] = '';
            });
            setFormData(defaultData);
            setImagePreview(null);
        }
    }, [initialData, fields]);

    // Handle file change
    const handleFileChange = useCallback((file: File, name: string) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
            setImagePreview(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const file = e.target.files?.[0];
            if (file) {
                handleFileChange(file, name);
            }
        } else {
            const { value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle ESC key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSubmitting) {
            onClose();
        }
    }, [onClose, isSubmitting]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const renderField = (field: FieldConfig) => {
        const baseInputClass = "border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent";

        switch (field.type) {
            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            name={field.name}
                            onChange={handleChange}
                            accept={field.accept}
                            className="hidden"
                            id={`file-${field.name}`}
                            required={field.required && !formData[field.name]}
                            disabled={isSubmitting}
                        />
                        <label
                            htmlFor={`file-${field.name}`}
                            className="cursor-pointer bg-white border rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <i className='bx bx-upload'></i>
                            Pilih Foto
                        </label>
                        {imagePreview && (
                            <div className="mt-2">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <select
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={baseInputClass}
                        required={field.required}
                        disabled={isSubmitting}
                    >
                        <option value="">Pilih {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={`${baseInputClass} min-h-[100px]`}
                        required={field.required}
                        placeholder={field.placeholder}
                        disabled={isSubmitting}
                    />
                );

            case 'date':
                return (
                    <DatePicker
                        name={field.name}
                        selected={formData[field.name] ? new Date(formData[field.name]) : null}
                        onChange={(date) => setFormData(prev => ({
                            ...prev,
                            [field.name]: date
                        }))}
                        dateFormat={field.dateFormat || "MM/dd/yyyy"}
                        showMonthYearPicker={field.showMonthYearPicker}
                        placeholderText={field.placeholder}
                        className={baseInputClass}
                        required={field.required}
                        disabled={isSubmitting}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={baseInputClass}
                        required={field.required}
                        placeholder={field.placeholder}
                        disabled={isSubmitting}
                    />
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) onClose();
            }}
        >
            <div className={`bg-white rounded-lg shadow-lg relative ${width} max-h-[80vh] overflow-hidden mx-4`}>
                <div className="bg-white p-4 sticky top-0 z-10 border-b">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl font-semibold text-[var(--text-semi-bold-color)]">
                        {title}
                    </h2>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-4rem)] p-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.name} className={`mb-4 ${field.colSpan === 2 ? 'col-span-2' : ''}`}>
                                <label className="block mb-1 text-[var(--text-semi-bold-color)]">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}

                        <div className="col-span-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem] disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <i className='bx bx-loader-alt animate-spin mr-2'></i>
                                        Loading...
                                    </span>
                                ) : (
                                    initialData ? 'Update' : 'Simpan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}