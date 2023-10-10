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

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL' : " https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/",
    'storageBucket' : "faceattendancerealtime-a8bc3.appspot.com"
})

# bucket = storage.bucket()   #bucket that will store the images that has been uploaded in the database

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

imgBackground = cv2.imread('Resources/background.png')
folderModePath = 'Resources/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = []

for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath, path)))

# print((len(imgModeList)))

# import the encoding files
file = open('EncodeGenerator.p', 'rb')
encodeListKnownwithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownwithIds
# print(studentIds)
print("Encoded file loaded")  #printing the status of load


modeType = 3
counter = 0
id = -1
# imgStudent = []

while True:
    success, img = cap.read()  # cap.read() reads the files, if it is an image, then it will read the vectors



    img_resized = cv2.resize(img,(765, 396), None, 0.25,0.25 ) # resize() function is used to resize the camera output to specifed length
    # img_resized = cv2.cvtColor(img_resized,cv2.COLOR_BGR2RGB)
    # img_resized1 = cv2.resize(imgModeList[0], (445, 415))  # and breadth!!

    faceCurFrame = face_recognition.face_locations(img_resized)
    encodeCurFrame = face_recognition.face_encodings(img_resized,faceCurFrame)

    # so what's happening above is faceCurFrame will get the location of the image
    # and it is send as a parameter to encodeCurFrame ,, this function will encode
    # the face at that location



    imgBackground[354:354 + 396, 94:94 + 765] = img_resized  # here the position is mentioned!
    imgBackground[354:354 + 395, 958:958 + 398] = imgModeList[modeType]

    for encodeFace , faceLoc in zip(encodeCurFrame,faceCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown,encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown,encodeFace)
        # print("matches", matches)
        # print("FaceDis",faceDis)

        matchIndex = np.argmin(faceDis)
        # print("Match Index : ", matchIndex)

        if matches[matchIndex]:
            # print("Known face detected!", )
            # print(studentIds[matchIndex])
            #try going out of the loop

            y1,x2,y2,x1 = faceLoc
            # print(x1,x2,y1,y2)
            # y1, x2, y2, x1 = y1*4,x2*4,y2*4,x1*4
            bbox =  94 + x1,  354 + y1 , x2 - x1, y2 - y1
            imagBackground =  cvzone.cornerRect(imgBackground,bbox,rt=0)
            id = studentIds[matchIndex]
            if counter == 0 :
                counter = 1
                modeType = 0

    if counter!=0:
        if counter == 1:

            # get the data
            studentInfo = db.reference(f'Students/{id}').get()
            print(studentInfo)
            #get the image
            # blob = bucket.get_blob(f'Images/{id}').get()
            # array = np.frombuffer(blob.download_as_string(), np.uint8)  #creating an array to store the download image
            # imgStudent = cv2.imdecode(array, cv2.COLOR_BGRA2RGB)
            #not implementing "showing image" here!!


            #update data of attendance in firebase
            datatimeObject = datetime.strptime(studentInfo['last_attendance_time'],"%y-%m-%d %H:%M:%S")

            secondsElapsed = (datetime.now()-datetimeObject).total_seconds()
            ref = db.reference(f'Students/{id}')
            studentInfo['total_attendance']+=1
            ref.child('total_attendance').set(studentInfo['total_attendance'])
            ref.child('last_attendance_time').set(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


        cv2.putText(imgBackground,str(studentInfo['name']),(1112,604),
                    cv2.FONT_HERSHEY_DUPLEX,1,(0,0,0),2)
        cv2.putText(imgBackground, str(studentIds[matchIndex]), (1112, 640),
                    cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.putText(imgBackground, str(studentInfo['section']), (1112, 675),
                    cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.putText(imgBackground, str(studentInfo['branch']), (1112, 715),
                    cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)


        counter +=1

        # if studentInfo['total_attendance'] > 1:


        if counter > 10 :
            counter = 0
            modeType = 3
            studentInfo = []


    cv2.imshow("face attendance", imgBackground)  # to output the camera!!
    cv2.waitKey(1)

cap.release()
cv2.destroyAllWindows()
