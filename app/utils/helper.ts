export const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export const formatRupiah = (value: number | string): string => {
    // Konversi input ke number
    const numericValue = typeof value === 'string' ? 
        parseFloat(value.replace(/[^\d.-]/g, '')) : 
        value;

    // Jika bukan number valid, return Rp 0
    if (isNaN(numericValue)) {
        return 'Rp 0';
    }

    // Format ke Rupiah
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericValue);
};