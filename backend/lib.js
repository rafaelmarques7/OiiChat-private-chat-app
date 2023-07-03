const writeMessageToDb = (db, message) => {
  db.messages.insert(message, (err, doc) => {
    if (err) return err;
    return doc;
  });
};

module.exports = {
  writeMessageToDb,
};
