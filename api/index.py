# api/index.py
import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

# --------------------------------------------------------------------------
# PENYESUAIAN VERCEL: Menambahkan 'src' ke path agar bisa impor modul
# --------------------------------------------------------------------------
# Ini memungkinkan kita mengimpor 'NovelChemicalDiscoveryAgent' dari 'src/model'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# --------------------------------------------------------------------------

# Impor dari 'src/model' sekarang akan berfungsi
from src.model.NovelChemicalDiscoveryAgent import NovelChemicalDiscoveryAgent 

# ==============================================================================
# 1. ⚙️ KONFIGURASI FASTAPI
# ==============================================================================

# PENTING: Ganti nama 'app' menjadi 'app' jika berbeda
app = FastAPI(title="Chemical Discovery Agent API", version="1.0.0")

# Di Vercel, CORS seringkali tidak diperlukan jika frontend & backend
# disajikan dari domain yang sama, tapi kita biarkan untuk keamanan.
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi Agen (Memuat model dan Gemini Client saat startup)
# Vercel akan menangani siklus hidupnya
agent = NovelChemicalDiscoveryAgent()


# ==============================================================================
# 2. 📚 DEFINISI SKEMA DATA (Pydantic)
# ==============================================================================

class CriteriaInput(BaseModel):
    Solubility: float
    Viscosity_cP: float
    ThermalStability_Score: float
    BoilingPoint_C: float

class CompoundProperties(BaseModel):
    SMILES: str
    IUPAC: str
    InChI: str
    InChIKey: str
    MolWeight: float
    ExactMass: float
    HBondDonors: int
    HBondAcceptors: int
    TPSA: float
    LogP: float
    RotatableBonds: int

class RecommendedCompound(BaseModel):
    SMILES: str
    Properties: CompoundProperties
    # --------------------------------------------------------------------------
    # PENYESUAIAN VERCEL: Path akan relatif terhadap root API
    # --------------------------------------------------------------------------
    Structure_2D_Path: Optional[str]
    Structure_3D_Path: Optional[str]
    # --------------------------------------------------------------------------


class DiscoveryResponse(BaseModel):
    recommended_compound: RecommendedCompound
    justification_ai: str


# ==============================================================================
# 3. 🗺️ ENDPOINT API
# ==============================================================================

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Chemical Discovery Agent API is running."}


@app.post("/discover", response_model=DiscoveryResponse)
async def discover_compound(criteria: CriteriaInput):
    """
    Endpoint utama untuk menemukan senyawa kimia baru.
    """
    try:
        # --------------------------------------------------------------------------
        # PENYESUAIAN VERCEL: Memberi tahu agen untuk menggunakan path /tmp
        # --------------------------------------------------------------------------
        agent.RESULTS_DIR = "/tmp" 
        # --------------------------------------------------------------------------

        compound_data_raw = agent.predict_and_lookup(criteria.dict())
        justification = agent.get_justification(criteria.dict(), compound_data_raw)
        
        # Mengubah path file menjadi path API yang bisa diakses publik
        if compound_data_raw["recommended_compound"].get("Structure_2D_Path"):
            filename_2d = os.path.basename(compound_data_raw["recommended_compound"]["Structure_2D_Path"])
            compound_data_raw["recommended_compound"]["Structure_2D_Path"] = f"/api/results/{filename_2d}"

        if compound_data_raw["recommended_compound"].get("Structure_3D_Path"):
            filename_3d = os.path.basename(compound_data_raw["recommended_compound"]["Structure_3D_Path"])
            compound_data_raw["recommended_compound"]["Structure_3D_Path"] = f"/api/results/{filename_3d}"

        final_response = {
            "recommended_compound": compound_data_raw["recommended_compound"],
            "justification_ai": justification
        }
        
        return final_response
    except Exception as e:
        # Logging error akan sangat membantu untuk debugging di Vercel
        print(f"An error occurred during discovery: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@app.get("/results/{filename}")
async def get_results_file(filename: str):
    """
    Menyajikan file hasil (gambar 2D, file MOL 3D) dari direktori sementara Vercel.
    """
    # --------------------------------------------------------------------------
    # PENYESUAIAN VERCEL: File dicari di direktori /tmp
    # --------------------------------------------------------------------------
    file_path = os.path.join("/tmp", filename)
    # --------------------------------------------------------------------------
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File tidak ditemukan di {file_path}")
    
    if filename.endswith(".png"):
        media_type = "image/png"
    elif filename.endswith(".mol"):
        media_type = "chemical/x-mol"
    else:
        media_type = "application/octet-stream"

    return FileResponse(file_path, media_type=media_type)
