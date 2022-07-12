import { newClientStub, newClient, dropAll, setSchema } from "./utils";

const main = async () => {
  const dgraphClientStub = newClientStub();
  const dgraphClient = newClient(dgraphClientStub);
  await dropAll(dgraphClient);
  await setSchema(dgraphClient);

  // Close the client stub.
  dgraphClientStub.close();
}

main()
  .then(() => {
    console.log("\nDone initializing Dgraph.");
  })
  .catch((e) => {
    console.log("Error initializing Dgraph: ", e);
  });
