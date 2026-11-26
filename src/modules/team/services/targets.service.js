import { api } from '../../../services/api';

export const targetsService = {
  async getTargets() {
    const { data } = await api.get('/admin/targets');
    return data?.data || [];
  },

  async createTarget(payload) {
    const { data } = await api.post('/admin/targets', payload);
    return data?.data;
  },

  async updateTarget(id, payload) {
    const { data } = await api.patch(`/admin/targets/${id}`, payload);
    return data?.data;
  },

  async deleteTarget(id) {
    await api.delete(`/admin/targets/${id}`);
  },
};

export default targetsService;
