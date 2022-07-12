import { StatusCodes } from "http-status-codes";

import userServise from "../../db/services/user";
import { createTokensPair } from "../../utils/token";

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newUser = await userServise.signUp({
      email,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      ...createTokensPair(newUser.id),
      user: newUser,
    });
  } catch (err) {
    if (err.type === "custom") {
      return res.status(err.code).json(err.message);
    }

    err.functionName = signUp.name;
    err.fileName = __filename;
    next(err);
  }
};

export default signUp;
