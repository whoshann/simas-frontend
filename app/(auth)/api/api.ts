const BASE_URL = 'http://localhost:3333'; // URL API NestJS Anda

export const loginUser = async (identifier: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: identifier, password }),
    });

    if (!response.ok) {
      throw new Error('Gagal login. Periksa kembali identitas dan kata sandi Anda.');
    }

    return await response.json(); // Mengembalikan token atau data user
  } catch (error: any) {
    throw error.message || 'Terjadi kesalahan saat login.';
  }
};
