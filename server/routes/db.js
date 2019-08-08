const MongoClient = require('mongodb').MongoClient

const client = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true })
const dbName = process.env.DBNAME
const collectionName = 'table'

createFilterObj = filter => {
  return Object.keys(filter).reduce((accum, field) => {
    return {
      ...accum,
      [field]: new RegExp(filter[field], 'i')
    }
  }, {})
}

const searchFromDB = async (req, res) => {
  await client.connect({ useNewUrlParser: true })
  const db = client.db(dbName)
  const filter = createFilterObj(req.query)
  docs = await findDocumentsByText(db, filter)
  result = {
    exists: docs && docs.length ? true : false,
    amount: docs.length,
    routes: docs
  }
  return res.status(200).json(result)
}

const findDocumentsByText = async (db, filter) => {
  const collection = db.collection(collectionName)
  docs = await collection.find(filter)
  return docs.toArray()
}

module.exports = searchFromDB
