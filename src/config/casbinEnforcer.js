import { newEnforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoURI = process.env.MONGO_DB;

export const getCasbinEnforcer = async () => {
    const adapter = await MongoAdapter.newAdapter({
        uri: mongoURI,
        database: 'pbac-test',  
        collection: 'casbinPolicies',  
    });

    const modelPath = path.resolve(__dirname, '../utils/model.conf');

    const enforcer = await newEnforcer(modelPath, adapter);

    await enforcer.loadPolicy();

    return enforcer;
};
