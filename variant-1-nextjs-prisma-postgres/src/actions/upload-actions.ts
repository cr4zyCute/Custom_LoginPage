"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  // Basic validation
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Invalid file type. Only images are allowed." };
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File too large (max 5MB)" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `theme-bg-${uniqueSuffix}.${ext}`;
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Return relative path for public access
    const url = `/uploads/${filename}`;
    return { success: true, url };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to save file" };
  }
}
