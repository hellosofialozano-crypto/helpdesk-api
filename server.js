require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 HelpDesk API started successfully");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌍 Environment : ${NODE_ENV}`);
  console.log(`📡 Server      : http://localhost:${PORT}`);
  console.log(`📚 Swagger     : http://localhost:${PORT}/api/docs`);
  console.log(`❤️ Health      : http://localhost:${PORT}/health`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
});

server.on("error", (error) => {
  console.error("❌ Failed to start server.");

  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error(error);
  }

  process.exit(1);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
