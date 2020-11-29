import { Router } from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
import QrCodeController from "./app/controllers/QrCodeController";

const routes = new Router();


routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
// routes.use(authMiddleware);
routes.get("/users", UserController.index);
routes.delete("/users/:id", UserController.delete);
routes.get("/users/:id", UserController.show);
routes.put("/users/:id", UserController.update);

routes.post("/users/:user_id/qrcode", QrCodeController.create);
routes.get("/users/:user_id/qrcode", QrCodeController.index);
routes.delete("/users/:user_id/qrcode/:id", QrCodeController.delete);
routes.get("/validator/user/:user_id/secret/:secret", QrCodeController.validateQrcode);

export default routes;
