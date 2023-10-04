import os
import pickle
import cv2
import face_recognition

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


while True:
    success, img = cap.read()  # cap.read() reads the files, if it is an image, then it will read the vectors



    img_resized = cv2.resize(img,(765, 396), None, 0.25,0.25 ) # resize() function is used to resize the camera output to specifed length
    img_resized = cv2.cvtColor(img_resized,cv2.COLOR_BGR2RGB)
    # img_resized1 = cv2.resize(imgModeList[0], (445, 415))  # and breadth!!

    faceCurFrame = face_recognition.face_locations(img_resized)
    encodeCurFrame = face_recognition.face_encodings(img_resized,faceCurFrame)

    # so what's happening above is faceCurFrame will get the location of the image
    # and it is send as a parameter to encodeCurFrame ,, this function will encode
    # the face at that location



    imgBackground[354:354 + 396, 94:94 + 765] = img_resized  # here the position is mentioned!
    imgBackground[354:354 + 395, 958:958 + 398] = imgModeList[1]




    cv2.imshow("face attendance", imgBackground)  # to output the camera!!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
