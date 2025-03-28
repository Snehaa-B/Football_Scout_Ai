from fastapi import FastAPI, UploadFile, File
import uvicorn
# import cv2
import numpy as np
# from models.yolo_detect import detect_players
# from models.deep_sort import track_players
# from models.event_recognition import recognize_action

app = FastAPI()

# @app.post("/analyze/")
# async def analyze_video(file: UploadFile = File(...)):
#     # Read video
#     contents = await file.read()
#     np_arr = np.frombuffer(contents, np.uint8)
#     frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

#     # AI Processing
#     players = detect_players(frame)
#     tracked_players = track_players(players)
#     actions = recognize_action(tracked_players)

#     return {"players_detected": players, "actions": actions}
@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
