import { Db, Document, MongoClient, ServerApiVersion } from "mongodb";

class DatabaseService {
    private client: MongoClient | undefined;
    private db: Db | undefined;

    async connect(uri: string) {
        try {
            this.client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });
            await this.client.connect();
            this.db = this.client.db(process.env.DB_NAME);

            console.log("Succesfully connected to the database");
        } catch (error) {
            console.error(error);
        }
    }

    getCollection<T extends Document>(name: string) {
        return this.db?.collection<T>(name);
    }
}

const dbService = new DatabaseService();

export default dbService;