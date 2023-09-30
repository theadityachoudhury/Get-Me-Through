import os
import cv2


cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)


imgBackground = cv2.imread('Resources/background.png')
folderModePath = 'Resources/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = []

for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath,path)))

print((len(imgModeList)))


while True:
    success, img = cap.read()       #cap.read() reads the files, if it is an image, then it will read the vectors

    img_resized = cv2.resize(img, (765, 396))     #resize() function is used to resize the camera output to specifed length
    # img_resized1 = cv2.resize(imgModeList[0], (445, 415))                                       #and breadth!!
    imgBackground[354:354 + 396, 94:94 + 765] = img_resized #here the position is mentioned!
    imgBackground[354:354 + 395, 958:958 + 398] = imgModeList[1]
    cv2.imshow("face attendance", imgBackground) #to output the camera!!

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()