"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("DRK Hospital Global Fatal Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: "24px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#14234B",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            padding: "36px 28px",
            borderRadius: "20px",
            border: "1px solid #DCE8F0",
            backgroundColor: "#F8FDFF",
            boxShadow: "0 4px 20px rgba(7, 27, 104, 0.06)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              backgroundColor: "#EFFBFC",
              color: "#087FBA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            !
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#071B68",
              margin: "0 0 10px",
            }}
          >
            DRK Hospital
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#5D6B85",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            The hospital application encountered a critical system error. Please refresh the page to reload the portal.
          </p>

          {error?.digest && (
            <p
              style={{
                fontSize: "11px",
                color: "#8FA0B5",
                fontFamily: "monospace",
                marginBottom: "20px",
              }}
            >
              Error Ref: {error.digest}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                backgroundColor: "#071B68",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              Reload Portal
            </button>
            <a
              href="/"
              style={{
                padding: "11px 24px",
                borderRadius: "9999px",
                backgroundColor: "#FFFFFF",
                color: "#071B68",
                fontWeight: 700,
                fontSize: "13px",
                border: "1px solid #DCE8F0",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Return to Homepage
            </a>
          </div>

          <p
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #DCE8F0",
              fontSize: "12px",
              color: "#5D6B85",
              margin: "24px 0 0",
            }}
          >
            Helpline: <strong style={{ color: "#071B68" }}>+91 44 2345 6789</strong>
          </p>
        </div>
      </body>
    </html>
  );
}

