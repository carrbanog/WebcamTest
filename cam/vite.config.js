import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // 외부에서 접근할 수 있도록 설정
    port: 5173, // 포트 번호 (원하는 대로 변경 가능)
    allowedHosts: ["13db-220-89-15-23.ngrok-free.app"],
  },
  plugins: [react()],
});
