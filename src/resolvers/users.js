import {
  ChangeUserError,
  CreateUserError,
  InternalServerError,
} from "../error/testGraphError";
import db from "../db/db";
import bcrypt from "bcrypt";

const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const path = require("path");

const { user } = db;

export const resolvers = {
  Query: {
    getAllUsers: async (_, args) => {
      try {
        const { page = 1, count = 5 } = args;
        console.log(page);
        const limit = count;
        let offset = page * count - count;

        const users = await user.findAndCountAll({
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          // where: {}, // conditions
        });
        // const users = await User.findAll()
        // console.log(users);
        return users.rows;
      } catch (err) {
        return err;
      }
    },
    getUser: (_, { id }) => {
      console.log(id);
      return users.find((user) => user.id == id);
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const email = input.email;
        if (
          await user.findOne({
            where: {
              email,
            },
          })
        ) {
          throw new CreateUserError({
            errors: {
              something: "bla-bla-bla",
            },
            internalData: {
              error: `User already exists.`,
            },
          });
        }

        const hashPassword = await bcrypt.hash(input.password, 5);
        const newUser = await user.create({ ...input, password: hashPassword });

        return newUser;
      } catch (err) {
        console.log({ ...err, errors: { message: "asdadadasdas" } });
        return err;
      }
    },
    changeUser: async (_, { input }) => {
      try {
        const candidate = await user.findOne({
          where: {
            id: input.id,
          },
        });

        if (!candidate) {
          // console.log(new ChangeUserError);
          throw new ChangeUserError({
            errors: {
              something: "bla-bla-bla",
            },
            internalData: {
              error: `The SQL server is almost dead.`,
            },
          });
        }

        if (input.firstName) {
          candidate.firstName = input.firstName;
        }
        if (input.lastName) {
          candidate.lastName = input.lastName;
        }
        if (input.gender) {
          candidate.gender = input.gender;
        }
        if (input.status) {
          candidate.status = input.status;
        }

        await user.update(
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

        return candidate;
      } catch (err) {
        if (err.internalData) {
          console.log("");
          console.log(err.internalData);
          console.log(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );
          console.log("");
          return err;
        }
        console.log("SERVER DOWN ON CHANGE USER");
        console.log(err);
        return new InternalServerError();
      }
    },
  },
};
