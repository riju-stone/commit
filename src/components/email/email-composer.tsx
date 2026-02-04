import { useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import { useSendEmailMutation } from "@/hooks/useGmailQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Paperclip } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { DraftEmail } from "@/types/email";

interface EmailComposerProps {
  onClose?: () => void;
  replyTo?: {
    to: string[];
    subject: string;
    body: string;
  };
}

export default function EmailComposerComponent({ onClose, replyTo }: EmailComposerProps) {
  const { connectedAccount } = useEmailStore();
  const sendEmailMutation = useSendEmailMutation();

  const [to, setTo] = useState(replyTo?.to.join(", ") || "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : "");
  const [attachments, setAttachments] = useState<File[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: replyTo ? `<blockquote>${replyTo.body}</blockquote><p></p>` : "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-white/80",
      },
    },
  });

  const handleSend = async () => {
    if (!connectedAccount || !to.trim()) {
      return;
    }

    const htmlBody = editor?.getHTML() || "";
    const textBody = editor?.getText() || "";

    const draft: DraftEmail = {
      to: to
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
      cc: cc
        ? cc
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean)
        : undefined,
      bcc: bcc
        ? bcc
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean)
        : undefined,
      subject: subject.trim(),
      body: textBody,
      htmlBody: htmlBody,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    try {
      await sendEmailMutation.mutateAsync(draft);
      // Reset form
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setAttachments([]);
      editor?.commands.clearContent();
      onClose?.();
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (!connectedAccount) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <p className="text-sm">Connect your account to send emails</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black/50">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{replyTo ? "Reply" : "New Message"}</h2>
        {onClose && (
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-white/60 hover:text-white">
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-shrink-0 p-4 space-y-3 border-b border-white/10">
          <div>
            <label className="text-xs text-white/60 mb-1 block">To</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Cc</label>
            <Input
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Bcc</label>
            <Input
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="bcc@example.com"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div>
              <label className="text-xs text-white/60 mb-1 block">Attachments</label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-xs text-white/80"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAttachment(index)}
                      className="h-4 w-4 text-white/60 hover:text-white"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input type="file" multiple onChange={handleAttachment} className="hidden" />
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" asChild>
              <span>
                <Paperclip className="size-4 mr-2" />
                Attach
              </span>
            </Button>
          </label>
        </div>

        <Button
          onClick={handleSend}
          disabled={sendEmailMutation.isPending || !to.trim() || !subject.trim()}
          className="gap-2"
        >
          <Send className="size-4" />
          {sendEmailMutation.isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
