import express from 'express';
// ---------------------------
import { fileURLToPath } from 'node:url';
import path from 'node:path';
// ---------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------------
const app = express();
const PORT = process.env.PORT ?? 1234;
// ---------------------------
app.use(express.static(path.join(__dirname, 'public')));
// ---------------------------
const pathMiddleware = (req, res, next) => {
	const unexpectedPath = req.path.endsWith('.json');
	if (unexpectedPath) {
		return res.status(403).send('Access Denied'); // Block the request
	}
	next();
};
// ---------------------------
app.get('/{*splat}', pathMiddleware, async (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ---------------------------
app.listen(PORT, () => console.log(`🚀 Server listening on port: ${PORT}`));
