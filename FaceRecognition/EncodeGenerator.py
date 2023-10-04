import os
import cv2
import face_recognition
import pickle

# importing student Images

folderPath = 'D:\PROGRAMMING\PROJECTS\Student Participation Tracker\FaceRecognition\Images'
PathList = os.listdir(folderPath)
imgList = []
studentIds = []  # we need student also

for path in PathList:  # path will give the name of the image
    imgList.append(cv2.imread(os.path.join(folderPath, path)))
    studentIds.append(os.path.splitext(path)[0])

print(studentIds)


def findEncoding(imagesList):
    encodeList = []
    for img in imagesList:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList


print("Encoding Started . . .")
encodeListKnown = findEncoding(imgList)
encodeListKnownwithIds = [encodeListKnown, studentIds]
print("Encoding has completed!")


#pickling the encodedList -- making it to bytestream

file = open("EncodeGenerator.p",'wb')
pickle.dump(encodeListKnownwithIds,file)
file.close()
print("File pickled and saved")