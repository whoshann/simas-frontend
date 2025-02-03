import Swal from 'sweetalert2';

export const showConfirmDelete = async (title: string = 'Apakah Anda yakin?', text: string = '') => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--main-color)',
        cancelButtonColor: 'var(--fourth-color)',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
    });

    return result.isConfirmed;
};

export const showSuccessAlert = (title: string = 'Berhasil!', text: string = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: 'var(--main-color)',
    });
};

export const showErrorAlert = (title: string = 'Error!', text: string = 'Terjadi kesalahan') => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: 'var(--main-color)',
    });
};