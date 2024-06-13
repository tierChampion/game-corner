
export const HTTPInterface = {
  SERVER_URL: `/api`,

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

export interface Room {
  _id: string,
  members: string[],
}

export interface Game {
  _id: string,
  board: number[],
  bank: number[],
  pick: number
}

export default class HTTPManager {
  private roomEndpoint: string;
  private gameEndpoint: string;

  constructor() {
      this.roomEndpoint = "rooms";
      this.gameEndpoint = "games";
   }

  async getAllRooms(): Promise<Room[]> {
    return await HTTPInterface.GET(this.roomEndpoint);
  }

  async getRoom(roomId: string): Promise<Room> {
    return await HTTPInterface.GET(`${this.roomEndpoint}/${roomId}`);
  }

  async createRoom(): Promise<Room> {
    return await HTTPInterface.POST(this.roomEndpoint, {});
  }

  async getGame(gameId: string): Promise<Game> {
    return await HTTPInterface.GET(`${this.gameEndpoint}/${gameId}`);
  }
}
