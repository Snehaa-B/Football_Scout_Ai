from fastapi import FastAPI
from routes.upload import router as upload_router
from routes.analyze import router as analyze_router

app = FastAPI()

app.include_router(upload_router, prefix="/upload")
app.include_router(analyze_router, prefix="/analyze")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
