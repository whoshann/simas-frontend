import React from 'react';
import Image from 'next/image';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'file' | 'number' | 'email' | 'password' |
    'textarea' | 'checkbox' | 'radio' | 'time' | 'datetime-local' | 'tel' |
    'url' | 'search' | 'month' | 'week' | 'color' | 'range' | 'hidden';
    options?: { value: string; label: string; }[];
    required?: boolean;
    value?: any;
    placeholder?: string;
    min?: number | string;
    max?: number | string;
    step?: number;
    rows?: number;
    cols?: number;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    className?: string;
    helperText?: string;
    error?: string;
    preview?: boolean; // Untuk preview gambar
}

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    title: string;
    mode: 'add' | 'edit';
    fields: FormField[];
    formData: any;
    setFormData: (data: any) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    submitLabel?: string;
    cancelLabel?: string;
}

const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    mode,
    fields,
    formData,
    setFormData,
    size = 'lg',
    submitLabel,
    cancelLabel = 'Batal'
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (fieldName: string, value: any) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    // Fungsi untuk menampilkan preview gambar
    const renderImagePreview = (fieldName: string) => {
        const file = formData[fieldName];
        if (!file) return null;

        if (typeof file === 'string') {
            // Jika file adalah URL string
            return (
                <Image
                    src={file}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mt-2 rounded-lg object-cover"
                />
            );
        } else if (file instanceof File) {
            // Jika file adalah File object
            return (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="mt-2 w-24 h-24 rounded-lg object-cover"
                />
            );
        }
        return null;
    };

    const renderField = (field: FormField) => {
        const baseClassName = `w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] ${field.error ? 'border-red-500' : ''
            } ${field.className || ''}`;

        switch (field.type) {
            case 'select':
                return (
                    <div>
                        <select
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className={baseClassName}
                            required={field.required}
                            disabled={field.disabled}
                        >
                            <option value="">Pilih {field.label}</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {field.helperText && (
                            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                        )}
                        {field.error && (
                            <p className="mt-1 text-sm text-red-500">{field.error}</p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div>
                        <textarea
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className={baseClassName}
                            required={field.required}
                            placeholder={field.placeholder}
                            rows={field.rows || 4}
                            cols={field.cols}
                            disabled={field.disabled}
                            readOnly={field.readOnly}
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                        />
                        {field.helperText && (
                            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                        )}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData[field.name] || false}
                            onChange={(e) => handleInputChange(field.name, e.target.checked)}
                            className="w-4 h-4 text-[var(--main-color)] border-gray-300 rounded focus:ring-[var(--main-color)]"
                            required={field.required}
                            disabled={field.disabled}
                        />
                        {field.helperText && (
                            <span className="ml-2 text-sm text-gray-500">{field.helperText}</span>
                        )}
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    type="radio"
                                    value={option.value}
                                    checked={formData[field.name] === option.value}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    className="w-4 h-4 text-[var(--main-color)] border-gray-300 focus:ring-[var(--main-color)]"
                                    required={field.required}
                                    disabled={field.disabled}
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            onChange={(e) => handleInputChange(field.name, e.target.files ? e.target.files[0] : null)}
                            className={baseClassName}
                            accept={field.accept}
                            required={field.required}
                            multiple={field.multiple}
                            disabled={field.disabled}
                        />
                        {field.preview && renderImagePreview(field.name)}
                        {field.helperText && (
                            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                        )}
                    </div>
                );

            case 'range':
                return (
                    <div>
                        <input
                            type="range"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className={baseClassName}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            disabled={field.disabled}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{field.min}</span>
                            <span>{field.max}</span>
                        </div>
                    </div>
                );

            default:
                return (
                    <div>
                        <input
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className={baseClassName}
                            required={field.required}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            disabled={field.disabled}
                            readOnly={field.readOnly}
                            autoComplete={field.autoComplete}
                            pattern={field.pattern}
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                        />
                        {field.helperText && (
                            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                        )}
                        {field.error && (
                            <p className="mt-1 text-sm text-red-500">{field.error}</p>
                        )}
                    </div>
                );
        }
    };

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[var(--text-semi-bold-color)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <i className='bx bx-x text-2xl'></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[var(--main-color)] rounded-lg hover:bg-[#1a4689]"
                        >
                            {submitLabel || (mode === 'add' ? 'Tambah' : 'Simpan Perubahan')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormModal;