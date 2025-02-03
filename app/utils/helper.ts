export const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });
};