import authControl from "../controllers/auth";
import isAuth from '../middleware/isAuth';

export default function(router) {
  router.post("/signup", authControl.signUp);
  router.post('/login', authControl.signIn);
  router.get('/me', isAuth, authControl.me);
};
