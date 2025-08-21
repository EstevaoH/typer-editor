import { FileUploader } from "@/components/file-upload";

export default function Upload() {
    return (
        <main className="container mx-auto py-10 px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">File Upload</h1>
                <p className="text-muted-foreground mb-8">Upload files to your application using the file uploader below. Supports images, PDFs, and document files.</p>
                <FileUploader />
            </div>
        </main>
    )
}