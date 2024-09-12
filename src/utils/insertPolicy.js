import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config();

const mongoURI = 'mongodb+srv://gochootech:gochootech@cluster0.nd1ma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function insertCasbinPolicies() {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('pbac-test'); 
        const collection = database.collection('casbinPolicies'); 

        const policies = [
            { ptype: 'p', v0: 'IT', v1: '/api/v1/destination', v2: 'POST' },                 
            { ptype: 'p', v0: 'IT', v1: '/api/v1/destination/*', v2: 'GET' },              
            { ptype: 'p', v0: 'IT', v1: '/api/v1/destination/*', v2: 'PATCH' },            
            { ptype: 'p', v0: 'IT', v1: '/api/v1/destination/*', v2: 'DELETE' },          

            { ptype: 'p', v0: 'owner', v1: '*', v2: '*' },                                   
        ];

        const result = await collection.insertMany(policies);

        console.log(`${result.insertedCount} policies inserted.`);
    } catch (error) {
        console.error('Error inserting policies:', error);
    } finally {
        await client.close();
    }
}

insertCasbinPolicies();
