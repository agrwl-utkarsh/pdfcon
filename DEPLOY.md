# Deploy Guide (PDFPilot)

This guide deploys:
- Frontend (Next.js) on Vercel
- Backend (FastAPI) on Render

## 1) Backend on Render
1. Open Render and click **New +** → **Web Service**.
2. Connect GitHub and select `agrwl-utkarsh/pdfcon`.
3. Set **Root Directory** to `pdfpilot/backend`.
4. Build Command:
   ```bash
   pip install -r requirements.txt
   ```
5. Start Command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Add Env Var:
   - `FRONTEND_ORIGINS` = `https://<your-vercel-domain>`
7. Deploy and copy the service URL (example: `https://pdfpilot-api.onrender.com`).

## 2) Frontend on Vercel
1. Open Vercel and click **Add New** → **Project**.
2. Import `agrwl-utkarsh/pdfcon`.
3. Set **Root Directory** to `pdfpilot/frontend`.
4. Add Env Var:
   - `NEXT_PUBLIC_API_BASE` = `https://<your-render-backend-url>`
5. Deploy.

## 3) Verify
- Open your Vercel URL.
- Try Merge/Split.
- If you see CORS errors, confirm `FRONTEND_ORIGINS` matches the Vercel URL exactly.

## One-click options
- Render: use `render.yaml` (root)
- Vercel: uses `vercel.json` (root)
