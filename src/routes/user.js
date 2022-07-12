import userController from "../controllers/users/users";
import isAuth from '../middleware/isAuth';

export default (router) => {
  router.post("/edit", isAuth, userController.editUser);
  router.post("/set-avatar", /*isAuth,*/ userController.setAvatar);
  router.get("/get-user/:id", userController.getUser);
};
