import os
import cv2
import face_recognition
import pickle
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
import subprocess

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL' : " https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/",
    'storageBucket' : "faceattendancerealtime-a8bc3.appspot.com"
})

# importing student Images

folderPath = 'Images'
PathList = os.listdir(folderPath)
imgList = []
studentIds = []  # we need student also

subprocess.run(["python","firebase_image_dwld.py"])



if os.path.exists('Images') and os.listdir('Images'):
    # Perform encoding of the downloaded images here
    # Your encoding logic goes here
    print("Encoding the downloaded images...")
    for path in PathList:  # path will give the name of the image
        imgList.append(cv2.imread(os.path.join(folderPath, path)))
        studentIds.append(os.path.splitext(path)[0])

        fileName = f'{folderPath}/{path}'
        bucket = storage.bucket()
        blob = bucket.blob(fileName)
        blob.upload_from_filename(fileName)

    print(studentIds)


    def findEncoding(imagesList):
        encodeList = []
        for img in imagesList:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encode = face_recognition.face_encodings(img)[0]
            encodeList.append(encode)
        return encodeList


    print("Encoding Started . . .")
    encodeListKnown = findEncoding(imgList)
    encodeListKnownwithIds = [encodeListKnown, studentIds]
    print("Encoding has completed!")

    # pickling the encodedList -- making it to bytestream

    file = open("EncodeGenerator.p", 'wb')
    pickle.dump(encodeListKnownwithIds, file)
    file.close()
    print("File pickled and saved")

else:
    print("No files found in the download folder. Make sure the downloader script has completed successfully.")