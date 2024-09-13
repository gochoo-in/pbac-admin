import { newEnforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js'; // Import the logger

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoURI = process.env.MONGO_DB;

export const getCasbinEnforcer = async () => {
    try {
        // Create the MongoAdapter instance
        const adapter = await MongoAdapter.newAdapter({
            uri: mongoURI,
            database: 'pbac-test',  // The database name
            collection: 'casbinpolicies',  // The collection where Casbin policies are stored
        });

        const modelPath = path.resolve(__dirname, '../utils/model.conf'); // Path to the Casbin model file

        // Create the Casbin enforcer instance with the model and adapter
        const enforcer = await newEnforcer(modelPath, adapter);

        // Load the policy from the MongoDB collection
        await enforcer.loadPolicy();

        logger.info('Casbin enforcer created and policy loaded successfully'); // Log success

        return enforcer;
    } catch (error) {
        logger.error('Error creating Casbin enforcer or loading policy', { error: error.message });
        throw new Error('Failed to create Casbin enforcer');
    }
};
