import dotenv from 'dotenv';

dotenv.config();

import * as dgraph from 'dgraph-js';
import * as grpc from 'grpc';

import { schema } from '../schema';

const dgraphPort = process.env.DGRAPH_PORT || 9080;
const dgraphHost = process.env.DGRAPH_HOST || 'localhost';

// Create a client stub.
function newClientStub() {
    console.log('connecting on dgraphPort:', dgraphPort);
    return new dgraph.DgraphClientStub(
        `${dgraphHost}:${dgraphPort}`,
        grpc.credentials.createInsecure()
    );
}

// Create a client.
function newClient(clientStub) {
    const dgraphClient = new dgraph.DgraphClient(clientStub);
    // dgraphClient.setDebugMode(true);

    return dgraphClient;
}

// Drop All - discard all data and start from a clean slate.
async function dropAll(dgraphClient) {
    const op = new dgraph.Operation();
    op.setDropAll(true);
    await dgraphClient.alter(op);
}

// Set schema.
async function setSchema(dgraphClient) {
    const op = new dgraph.Operation();
    op.setSchema(schema);
    await dgraphClient.alter(op);
}

export { newClientStub, newClient, dropAll, setSchema };
