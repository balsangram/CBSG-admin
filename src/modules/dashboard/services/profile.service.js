import { api } from '../../../services/api';

export const profileService = {
  async getProfile() {
    const { data } = await api.get('/admin/profile');
    return data?.data;
  },

  async updateProfile(payload, photoFile) {
    const body = new FormData();

    if (payload.name !== undefined) body.append('name', payload.name);
    if (payload.email !== undefined) body.append('email', payload.email);
    if (payload.phone !== undefined) body.append('phone', payload.phone);
    if (photoFile) body.append('photo', photoFile);

    const { data } = await api.put('/admin/profile', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data?.data;
  },
};

export default profileService;
