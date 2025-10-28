import { Router } from "express";
import ItemController from "../controllers/ItemController.js";
import UsersController from "../controllers/UsersController.js";
const router = Router();

router.get("/items", ItemController.index);
router.get("/items/:id", ItemController.show);
router.post("/items", ItemController.create);
router.put("/items/:id", ItemController.update);
router.delete("/items/:id", ItemController.destroy);

router.get("/users", UsersController.index);
router.get("/users/:id", UsersController.show);
router.post("/users", UsersController.create);
router.put("/users/:id", UsersController.update);
router.delete("/users/:id", UsersController.destroy);

export default router;
