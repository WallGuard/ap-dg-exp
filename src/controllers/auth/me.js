const me = async (req, res, next) => {
  try {
    console.log("AUUUUUUTH");
    res.json(req.user);
  } catch (err) {
    console.log("AUTH ERROR");
    err.functionName = me.name;
    err.fileName = __filename;
    next(err);
  }
};

export default me;
