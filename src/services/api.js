import { sleep } from '../utils/helpers';

/**
 * Simulated enterprise API client
 */
export const api = {
  async post(endpoint, data = {}, delayMs = 600) {
    await sleep(delayMs);
    return {
      data,
      status: 200,
      timestamp: new Date().toISOString(),
    };
  },

  async get(endpoint, delayMs = 400) {
    await sleep(delayMs);
    return {
      status: 200,
      timestamp: new Date().toISOString(),
    };
  },
};

export default api;
