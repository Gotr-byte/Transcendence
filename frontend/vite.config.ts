import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"react-slick": path.resolve(__dirname, "node_modules/react-slick"),
			"slick-carousel": path.resolve(__dirname, "node_modules/slick-carousel"),
			// 'socket.io-client': path.resolve(__dirname,'node_modules/socket.io-client')
		},
	},
	plugins: [react()],
	server: {
		host: true,
		port: +process.env.FRONTEND_PORT!,
	},
});
