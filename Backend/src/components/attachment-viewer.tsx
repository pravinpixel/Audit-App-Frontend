import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttachmentViewerProps {
  url: string
  type: string
  onClose: () => void
}

export function AttachmentViewer({ url, type, onClose }: AttachmentViewerProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-50" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <div className="mt-4">
          {type === "image" && (
            <img src={url || "/placeholder.svg"} alt="Attachment" className="w-full h-auto rounded" />
          )}
          {type === "video" && (
            <video controls className="w-full h-auto rounded">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {type === "pdf" && <iframe src={url} className="w-full h-[70vh] rounded" />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
