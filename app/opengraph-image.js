import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #f7f3ec 0%, #fffdfa 48%, #f4efe6 100%)",
          color: "#152321",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                height: 78,
                width: 78,
                borderRadius: 24,
                background: "#152321",
                color: "#fff",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              GL
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: "#1b5e59",
                }}
              >
                Software Developer
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 700,
                }}
              >
                Glenn Luna
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: 999,
              padding: "10px 18px",
              background: "rgba(27, 94, 89, 0.1)",
              color: "#1b5e59",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Next.js • SEO • Infrastructure
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.06em",
            }}
          >
            Modern websites, custom software, and technical SEO.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(21, 35, 33, 0.75)",
              maxWidth: 900,
            }}
          >
            Full-stack product delivery with Next.js, server setup, networking,
            and maintainable systems for growing businesses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {["Next.js", "Custom Web Apps", "Technical SEO", "Server Setup"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: "#152321",
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(21, 35, 33, 0.68)",
            }}
          >
            glennluna.bindaddy.ca
          </div>
        </div>
      </div>
    ),
    size,
  );
}
