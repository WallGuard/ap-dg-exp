import jwt from "jsonwebtoken";

export const createAccessToken = (id) => {
  try {
    const payload = { id };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.ACCESS_EXPIRES,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createRefreshToken = (id) => {
  try {
    const payload = { id };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.REFRESH_EXPIRES,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createTokensPair = (id) => {
  try {
    return {
      access: createAccessToken(id),
      refresh: createRefreshToken(id),
    };
  } catch (err) {
    console.log(err);
  }
};

export const verifyToken = (token) => {
  // try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    return payload;
  // } catch (err) {
  //   // if (err.name === "JsonWebTokenError") {
  //   //   return err.name;
  //   // }
  //   console.log(err);
  // }
};
