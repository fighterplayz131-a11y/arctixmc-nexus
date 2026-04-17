import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store-context";
import { User } from "lucide-react";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { login } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(trimmed)) {
      setError("Username must be 3–16 chars (letters, numbers, _)");
      return;
    }
    login(trimmed);
    setName("");
    setError("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-full gradient-primary flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center font-display tracking-wider">Sign in to ArctixMC</DialogTitle>
          <DialogDescription className="text-center">
            Enter your Minecraft username to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input
            autoFocus
            placeholder="Notch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center font-medium tracking-wide"
          />
          {error && <p className="text-xs text-destructive text-center">{error}</p>}
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
