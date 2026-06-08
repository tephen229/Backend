import { Router } from "express";

import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUserById, 
  deleteUserById 
} from "../controllers/usersController.js";

const router = Router();

// CUKUP GUNAKAN TANDA "/" SAJA KARENA PREFIX "/users" SUDAH DIATUR DI INDEX.TS
router.post("/", createUser);         // Menjadi: POST http://localhost:3000/users
router.get("/", getAllUsers);          // Menjadi: GET http://localhost:3000/users
router.get("/:id", getUserById);      // Menjadi: GET http://localhost:3000/users/:id
router.put("/:id", updateUserById);   // Menjadi: PUT http://localhost:3000/users/:id
router.delete("/:id", deleteUserById); // Menjadi: DELETE http://localhost:3000/users/:id

export default router;