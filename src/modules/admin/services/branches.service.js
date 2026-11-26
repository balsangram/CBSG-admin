import { api } from '../../../services/api';

export const branchesService = {
  async getBranches() {
    const { data } = await api.get('/admin/branches');
    return data?.data || [];
  },

  async createBranch(payload) {
    const { data } = await api.post('/admin/branches', payload);
    return data?.data;
  },

  async updateBranch(id, payload) {
    const { data } = await api.patch(`/admin/branches/${id}`, payload);
    return data?.data;
  },

  async deleteBranch(id) {
    await api.delete(`/admin/branches/${id}`);
  },
};

export default branchesService;
