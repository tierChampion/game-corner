import { SERVER_URL } from "./consts";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function (endpoint: string) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint: string, data: Object) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint: string) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'DELETE',
    });
    return response.status;
  },

  PATCH: async function (endpoint: string) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'PATCH',
    });
    return response.status;
  },

  PUT: async function (endpoint: string, data: Object) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.status;
  },
};
