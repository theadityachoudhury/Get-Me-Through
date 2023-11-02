import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': " https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/"
})

ref = db.reference('Students')

data = {
    "2129013":
        {
            "name": "Adwaith PJ",
            "total_attendance": 0,
            "last_attendance_time": "2022-12-11 00:54:34"
        }, "2129011":
        {
            "name": "Aditya Choudh",
            "total_attendance": 0,
            "last_attendance_time": "2022-12-11 00:54:34"
        }, "2129010":
        {
            "name": "Aditya Singh",
            "total_attendance": 0,
            "last_attendance_time": "2022-12-11 00:54:34"
        }, "21052062":
        {
            "name": "Ashutosh",
            "total_attendance": 0,
            "last_attendance_time": "2022-12-11 00:54:34"
        }

}

for key, value in data.items():
    ref.child(key).set(value)
