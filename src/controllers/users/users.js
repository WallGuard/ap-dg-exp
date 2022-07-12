import ApiError from "../../error/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as uuid from "uuid";
import path from "path";
import db from "../../db/db";

const generateJwt = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class UserController {
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest("Некорректный email или password"));
      }
      const candidate = await db.user.findOne({
        where: {
          email,
        },
      });
      if (candidate) {
        return res
          .status(403)
          .json({ error: [{ message: "This email is already in use!" }] });
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await db.user.create({
        email,
        password: hashPassword,
      });
      const token = generateJwt(user.id, user.email);
      return res.json({
        token,
      });
    } catch (err) {
      console.log(err);
      if (err.type === "custom") {
        console.log(res.status(err.code).json(err.message));
        return res.status(err.code).json(err.message);
      }
      err.functionName = signUp.name;
      err.fileName = __filename;
      next(err);
    }
  }

  async editUser(req, res, next) {
    console.log('USER_ID:', req.user.id);
    console.log('USER_STATUS:', req.body.newUserData.status);
    const candidate = await db.user.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (req.body.firstName) {
      candidate.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      candidate.lastName = req.body.lastName;
    }
    if (req.body.gender === "male" || req.body.gender === "female") {
      candidate.gender = req.body.gender;
    }
    if (req.body.newUserData.status || req.body.newUserData.status === '') {
      candidate.status = req.body.newUserData.status;
    }

    await db.user.update(
      {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        gender: candidate.gender,
        status: candidate.status,
      },
      {
        where: {
          id: candidate.id,
        },
      }
    );
    return res.json(candidate);
  }

  // async login(req, res, next) {
  //   const {
  //     email,
  //     password
  //   } = req.body
  //   const user = await User.findOne({
  //     where: {
  //       email
  //     }
  //   })
  //   if (!user) {
  //     return next(ApiError.internal('Пользователь не найден'))
  //   }
  //   let comparePassword = bcrypt.compareSync(password, user.password)
  //   if (!comparePassword) {
  // +++
  //     return next(ApiError.internal('Указан неверный пароль'))
  //   }
  //   const token = generateJwt(user.id, user.email, user.role)
  //   return res.json({
  //     token
  //   })
  // };

  // async check(req, res, next) {
  //   const token = generateJwt(req.user.id, req.user.email, req.user.role)
  //   return res.json({
  //     token
  //   })
  // };

  async getUsers(req, res, next) {
    try {
      console.log("TYT");
      const { page = 1, count = 5 } = req.query;
      const limit = count;
      let offset = page * count - count;

      const users = await db.user.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
        // where: {}, // conditions
      });
      // const users = await User.findAll()
      // console.log(users);
      return res.json(users);
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await db.user.findOne({
        where: { id: id },
      });

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  }6

  async setAvatar(req, res, next) {
    try {
      const { id } = req.body;
      const { img } = req.files;
      console.log(uuid.v4);
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "..", "static", fileName));
      const avatar = await db.user.update(
        {
          img: fileName,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.json(avatar);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

export default new UserController();
