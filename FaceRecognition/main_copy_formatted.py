
import os
import pickle
import numpy as np
import cv2
import face_recognition
import cvzone
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
from datetime import datetime
import webbrowser
import subprocess

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': " https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/",
    'storageBucket': "faceattendancerealtime-a8bc3.appspot.com"
})

def on_mouse_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        # Define the region where the link should be opened
        if 912 < x < 964 and 62 < y < 76:  # Define your specific position here
            url = "https://www.google.com"  # Replace with your desired URL
            webbrowser.open_new_tab(url)

subprocess.run(['python', 'EncodeGenerator.py'])
subprocess.run(['python','AddDataToDatabase'])  # comment this out if the data is automatically added

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

imgBackground = cv2.imread('Resources/background.png')
folderModePath = 'Resources/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = []

for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath, path)))

# import the encoding files
file = open('EncodeGenerator.p', 'rb')
encodeListKnownwithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownwithIds
modeType = 3
counter = 0
id = -1

while True:
    success, img = cap.read()
    img_resized = cv2.resize(img, (765, 396), None, 0.25, 0.25)
    imgBackground[354:354 + 396, 94:94 + 765] = img_resized
    imgBackground[354:354 + 395, 958:958 + 398] = imgModeList[modeType]

    faceCurFrame = face_recognition.face_locations(img_resized)
    encodeCurFrame = face_recognition.face_encodings(img_resized, faceCurFrame)

    for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            y1, x2, y2, x1 = faceLoc
            bbox = 94 + x1, 354 + y1, x2 - x1, y2 - y1
            imgBackground = cvzone.cornerRect(imgBackground, bbox, rt=0)
            id = studentIds[matchIndex]
            if counter == 0:
                counter = 1
                modeType = 0

    if counter != 0:
        if counter == 1:
            studentInfo = db.reference(f'Students/{id}').get()
            datatimeObject = datetime.strptime(studentInfo["last_attendance_time"], "%Y-%m-%d %H:%M:%S")
            secondsElapsed = (datetime.now() - datatimeObject).total_seconds()
            if secondsElapsed > 60:
                ref = db.reference(f'Students/{id}')
                studentInfo['total_attendance'] += 1
                ref.child('total_attendance').set(studentInfo['total_attendance'])
                ref.child('last_attendance_time').set(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        cv2.putText(imgBackground, str(studentInfo['name']), (1112, 604), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.putText(imgBackground, str(studentIds[matchIndex]), (1112, 640), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.putText(imgBackground, str(studentInfo['section']), (1112, 675), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.putText(imgBackground, str(studentInfo['branch']), (1112, 715), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)

        counter += 1

        if counter > 10:
            counter = 0
            modeType = 3
            studentInfo = []

    cv2.imshow("face attendance", imgBackground)
    cv2.setMouseCallback("face attendance", on_mouse_click)
    cv2.waitKey(1)

cap.release()
cv2.destroyAllWindows()
