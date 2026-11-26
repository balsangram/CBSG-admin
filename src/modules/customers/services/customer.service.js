import { api } from '../../../services/api';

const withPhoto = (payload, photoFile) => {
  if (!photoFile) return payload;

  const body = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) body.append(key, value);
  });
  body.append('photo', photoFile);
  return body;
};

const requestConfig = (photoFile) => {
  if (!photoFile) return undefined;
  return { headers: { 'Content-Type': 'multipart/form-data' } };
};

export const customerService = {
  async getCustomers(params = {}) {
    const { data } = await api.get('/admin/customers', { params });
    return (
      data?.data || {
        customers: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        meta: { total: 0 },
      }
    );
  },

  async getCustomer(id) {
    const { data } = await api.get(`/admin/customers/${id}`);
    return data?.data;
  },

  async createCustomer(payload, photoFile) {
    const { data } = await api.post(
      '/admin/customers',
      withPhoto(payload, photoFile),
      requestConfig(photoFile)
    );
    return data?.data;
  },

  async updateCustomer(id, payload, files = {}) {
    const uploads = Object.entries(files).filter(([, file]) => file);

    if (!uploads.length) {
      const { data } = await api.put(`/admin/customers/${id}`, payload);
      return data?.data;
    }

    const body = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) body.append(key, value);
    });
    uploads.forEach(([key, file]) => body.append(key, file));

    const { data } = await api.put(`/admin/customers/${id}`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data;
  },

  async deleteCustomer(id) {
    await api.delete(`/admin/customers/${id}`);
  },

  async getAgents() {
    const { data } = await api.get('/admin/agents');
    return data?.data || [];
  },
};

export default customerService;
