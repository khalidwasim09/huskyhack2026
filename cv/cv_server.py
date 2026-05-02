import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.vision import HandLandmarker, FaceLandmarker
from mediapipe.tasks.python.vision import HandLandmarkerOptions, FaceLandmarkerOptions
from mediapipe.tasks.python.vision.core.vision_task_running_mode import VisionTaskRunningMode
import asyncio
import websockets
import json
from collections import deque

# --- Shared state ---
state = {"pan": 0.5, "choice": None}
choice_buffer = deque(maxlen=10)
pan_buffer = deque(maxlen=8)  # smoothing buffer

# Calibration — tune these to your face/camera
PAN_MIN = 0.35   # how far left you look (raw nose.x value)
PAN_MAX = 0.65   # how far right you look (raw nose.x value)

def normalize_pan(raw_x):
    # clamp and normalize to 0.0 - 1.0
    normalized = (raw_x - PAN_MIN) / (PAN_MAX - PAN_MIN)
    return round(max(0.0, min(1.0, normalized)), 3)

def count_fingers(hand_landmarks, handedness):
    tips = [8, 12, 16, 20]
    pip  = [6, 10, 14, 18]
    fingers_up = 0
    if handedness == "Right":
        if hand_landmarks[4].x < hand_landmarks[3].x:
            fingers_up += 1
    else:
        if hand_landmarks[4].x > hand_landmarks[3].x:
            fingers_up += 1
    for tip, p in zip(tips, pip):
        if hand_landmarks[tip].y < hand_landmarks[p].y:
            fingers_up += 1
    return fingers_up

def cv_loop():
    hand_options = HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path="hand_landmarker.task"),
        running_mode=VisionTaskRunningMode.IMAGE,
        num_hands=1,
        min_hand_detection_confidence=0.7,
        min_hand_presence_confidence=0.7,
        min_tracking_confidence=0.7,
    )
    face_options = FaceLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path="face_landmarker.task"),
        running_mode=VisionTaskRunningMode.IMAGE,
        num_faces=1,
        min_face_detection_confidence=0.7,
        min_face_presence_confidence=0.7,
        min_tracking_confidence=0.7,
    )
    cap = cv2.VideoCapture(0)
    print("Webcam started")
    with HandLandmarker.create_from_options(hand_options) as hand_detector, \
         FaceLandmarker.create_from_options(face_options) as face_detector:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            face_result = face_detector.detect(mp_image)
            if face_result.face_landmarks:
                nose = face_result.face_landmarks[0][1]
                pan_buffer.append(float(nose.x))
                smoothed = sum(pan_buffer) / len(pan_buffer)
                state["pan"] = normalize_pan(smoothed)
            hand_result = hand_detector.detect(mp_image)
            raw_choice = None
            if hand_result.hand_landmarks and hand_result.handedness:
                landmarks = hand_result.hand_landmarks[0]
                handedness_label = hand_result.handedness[0][0].display_name
                count = count_fingers(landmarks, handedness_label)
                if count in [1, 2, 3]:
                    raw_choice = count
            choice_buffer.append(raw_choice)
            if len(choice_buffer) == 10 and len(set(choice_buffer)) == 1:
                confirmed = choice_buffer[0]
                if confirmed != state["choice"]:
                    state["choice"] = confirmed
            elif raw_choice is None:
                state["choice"] = None
            cv2.putText(frame, f"Pan: {state['pan']}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Choice: {state['choice']}", (10, 70),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.imshow("CV Debug", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    cap.release()
    cv2.destroyAllWindows()

async def handler(websocket):
    print("Frontend connected")
    try:
        while True:
            await websocket.send(json.dumps(state))
            await asyncio.sleep(0.05)
    except websockets.exceptions.ConnectionClosed:
        print("Frontend disconnected")

async def main():
    print("CV server starting on ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, cv_loop)

asyncio.run(main())