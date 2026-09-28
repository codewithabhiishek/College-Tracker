import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full border border-border p-8 bg-card shadow-[4px_4px_0_#a3e635]">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-display font-black text-primary tracking-tight">404</h1>
            <div className="h-0.5 w-16 bg-primary mx-auto" />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-wider text-foreground">
              Page Not Found
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The requested path{" "}
              <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 border border-primary/20">
                /{pageName}
              </span>{" "}
              does not exist or has been relocated.
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all border border-primary shadow-[2px_2px_0_#000]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

