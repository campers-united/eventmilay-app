export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({ url, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
};
