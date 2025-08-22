"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, File, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { uploadFile } from "@/actions/upload-actions"


interface FileUploaderProps {
  maxSizeMB?: number
  allowedTypes?: string[]
  //@typescript-eslint/no-explicit-any
  onUploadComplete?: (url: any) => void
}

export function FileUploader({
  maxSizeMB = 5,
  allowedTypes = ["application/pdf", ".docx"],
  onUploadComplete,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    setError(null)

    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`)
      return false
    }

    // Check file type if allowedTypes is provided
    if (allowedTypes.length > 0) {
      const fileType = file.type
      const fileExtension = `.${file.name.split(".").pop()}`

      const isAllowed = allowedTypes.some((type) => {
        if (type.includes("*")) {
          // Handle wildcard types like "image/*"
          return fileType.startsWith(type.split("/")[0])
        }
        return type === fileType || type === fileExtension
      })

      if (!isAllowed) {
        setError(`File type not allowed. Accepted types: ${allowedTypes.join(", ")}`)
        return false
      }
    }

    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setProgress(0)
      setError(null)
      
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          return newProgress < 90 ? newProgress : prev
        })
      }, 300)

      const result = await uploadFile(file)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setUploadedUrl(result.url)
        if (onUploadComplete) {
          onUploadComplete(result.url)
        }
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (err) {
      setError("An unexpected error occurred during upload")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadedUrl(null)
    setProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const renderFilePreview = () => {
    if (!file) return null

    const isImage = file.type.startsWith("image/")

    return (
      <div className="mt-4 relative">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            {isImage ? (
              <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={uploading}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {!file && !uploadedUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium mt-2">Drag & drop your file here</h3>
            <p className="text-sm text-muted-foreground mb-2">or click to browse files</p>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={allowedTypes.join(",")}
            />
            <p className="text-xs text-muted-foreground mt-2">Max file size: {maxSizeMB}MB</p>
          </div>
        </div>
      )}

      {renderFilePreview()}

      {file && !uploadedUrl && (
        <>
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleRemoveFile} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </>
      )}

      {uploadedUrl && (
        <div className="rounded-lg border p-4 bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
            <Check className="h-5 w-5" />
            <span>File uploaded successfully!</span>
          </div>
          <p className="text-xs text-muted-foreground break-all">{uploadedUrl}</p>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleRemoveFile}>
              Upload Another File
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}
