import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: "Identifiants incorrects" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Identifiants incorrects" });

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, name: true },
    });
    if (!admin) return res.status(404).json({ error: "Admin introuvable" });
    res.json(admin);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
