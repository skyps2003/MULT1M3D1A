from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from PIL import Image
from PIL import Image
import io
import uvicorn
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Ruta principal para mostrar el HTML
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
# Ruta para los niveles de la aplicación
@app.get("/nivel1", response_class=HTMLResponse)
async def nivel1(request: Request):
    return templates.TemplateResponse("nivel1.html", {"request": request})

@app.get("/nivel2", response_class=HTMLResponse)
async def nivel2(request: Request):
    return templates.TemplateResponse("nivel2.html", {"request": request})

@app.get("/nivel3", response_class=HTMLResponse)
async def nivel3(request: Request):
    return templates.TemplateResponse("nivel3.html", {"request": request})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)