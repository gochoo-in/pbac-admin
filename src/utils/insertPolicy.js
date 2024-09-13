import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config();

const mongoURI = 'mongodb+srv://gochootech:gochootech@cluster0.nd1ma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function insertCasbinPolicies() {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('pbac-test'); 
        const collection = database.collection('casbinpolicies'); 

        const policies = [
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/destinations', v2: 'POST' },  
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/destinations', v2: 'GET' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/destinations/*', v2: 'PATCH' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/destinations/*', v2: 'DELETE' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/users', v2: 'GET' },  
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/users', v2: 'POST' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/users/*', v2: 'PATCH' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/users/*', v2: 'DELETE' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities', v2: 'GET' },  
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities', v2: 'POST' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities/*', v2: 'PATCH' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities/*', v2: 'DELETE' },
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities/*', v2: 'GET' },  
            { ptype: 'p', v0: '66e2de99d5ba40712a33c93a', v1: '/api/v1/cities/*/activities', v2: 'GET' },
            { ptype: 'p', v0: '66e2db59527086061fbaffb3', v1: '/api/v1/destinations', v2: 'GET' },
            { ptype: 'p', v0: '66e2db59527086061fbaffb3', v1: '/api/v1/destinations/*', v2: 'PATCH' },
            { ptype: 'p', v0: '66e2db59527086061fbaffb3', v1: '/api/v1/destinations/*', v2: 'DELETE' },
            { ptype: 'p', v0: '66e2db59527086061fbaffb3', v1: '/api/v1/destinations', v2: 'POST' }




        
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
