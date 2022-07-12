import { paramCase } from "param-case";
import { Router } from "express";
import requireDirectory from "require-directory";

const routes = requireDirectory(module, "./");

export default (app) => {
  Object.keys(routes).forEach((routeName) => {
    const router = Router();

    routes[routeName].default(router);

    app.use(`/api/${paramCase(routeName)}`, router);
  });
};
