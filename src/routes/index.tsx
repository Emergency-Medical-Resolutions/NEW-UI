import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => navigate({ to: "/dashboard" });
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [navigate]);

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
