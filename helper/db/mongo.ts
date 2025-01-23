import { MongoClient } from "mongodb";
const url:string = `${process.env.MONGOURL}`;
console.log(url);
const client = new MongoClient(url);
/**
 *
 * @param db database that you are connecting
 * @param collection collection of database
 * @param parametr parametr that you are filtering the data
 * @returns
 */
export async function connectToMongo(
  db: string,
  collection: string,
  parameter: object
): Promise<any> {
  await client.connect();
  const databasesList = client.db(db);

  const communityQA = databasesList.collection(collection);
  let findCommunity = await communityQA.findOne(parameter);
  //console.log(findCommunity,'findCommunity');
  return findCommunity;
}
