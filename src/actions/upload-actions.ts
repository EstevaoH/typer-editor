"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadFile(file: File) {
  try {
    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Upload the file to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    // Revalidate the path to update the UI
    revalidatePath("/")

    return {
      success: true,
      url: blob.url,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}
