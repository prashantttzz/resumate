import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { generatePDF } from "./generate/generate.js";
import { prisma } from "./prisma/client.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("PDF Generation Server is running");
});
app.post("/generate", async (req, res) => {
  const { resumeId, title } = req.body;
  if (!resumeId || !title) {
    return res.status(400).json({ error: "Missing resumeId or title" });
  }

  try {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { slug: true },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const fullUrl = `${process.env.BASE_URL}preview/${resume.slug}`;

    const pdfBuffer = await generatePDF(fullUrl);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PDF Server running on http://localhost:${PORT}`);
});
