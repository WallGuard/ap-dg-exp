import userController from "../controllers/users/users";

export default (router) => {
  router.get("/get-users", userController.getUsers);
};
