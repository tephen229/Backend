// simpan user
import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";

// 1. SIMPAN DATA USER (Register / Create)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, foto } = req.body;

  // Validasi input wajib
  if (!username || !password) {
    res.status(400).json({ message: "Username dan password wajib diisi" });
    return;
  }

  try {
    // Cek apakah username sudah digunakan (Menggunakan findFirst agar tidak error jika belum @unique)
    const existingUser = await prisma.users.findFirst({
      where: { username },
    });

    if (existingUser) {
      res.status(400).json({ message: "Username sudah digunakan, cari yang lain" });
      return;
    }

    // Hash password agar aman di database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database ke dalam tabel/model 'users'
    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        foto: foto || "", // Jika foto kosong, berikan string kosong
      },
    });

    // Kirim respons sukses tanpa password demi keamanan
    res.status(201).json({
      message: "User berhasil disimpan",
      data: {
        id: newUser.id,
        username: newUser.username,
        foto: newUser.foto,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

// 2. AMBIL SEMUA DATA USER
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        foto: true,
        created_at: true,
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data user", error });
  }
};

// 3. AMBIL USER BERDASARKAN ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        foto: true,
        created_at: true,
      },
    });

    if (!data) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// 4. UPDATE DATA USER
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { username, password, foto } = req.body;

    // Siapkan data cadangan yang mau di-update
    const updateData: any = { username, foto };

    // Jika user juga mengupdate password, lakukan hashing ulang
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const data = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: "User berhasil diperbarui", data: { id: data.id, username: data.username } });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user", error });
  }
};

// 5. HAPUS USER
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.users.delete({ where: { id } });
    res.json({ message: `User dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user atau user tidak ditemukan", error });
  }
};