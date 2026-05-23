import type { Request, Response } from "express";
import { prisma } from "../lib/db.js"; // Sesuaikan dengan jalur file db/prisma client kamu

// 1. GET ALL CATEGORIES
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil kategori", error });
  }
};

// 2. CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Menangkap 'name' atau 'nama' dari body request frontend agar lebih aman
    const { name, nama } = req.body; 
    const categoryName = name || nama;

    if (!categoryName) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: categoryName, // ← Diubah ke 'name' agar sesuai dengan schema.prisma kamu
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah kategori", error });
  }
};

// 3. GET CATEGORY BY ID (Untuk halaman Edit)
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail kategori", error });
  }
};

// 4. UPDATE CATEGORY BY ID
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, nama } = req.body;
    const categoryName = name || nama;

    if (!categoryName) {
      return res.status(400).json({ message: "Nama kategori wajib diisi untuk diperbarui" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { 
        name: categoryName, // Pastikan menggunakan kolom 'name' sesuai skema Prisma
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kategori", error });
  }
};

// 5. DELETE CATEGORY BY ID
export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori", error });
  }
};