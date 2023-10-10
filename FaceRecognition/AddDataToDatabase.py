import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL' : " https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/"
})


ref = db.reference('Students')

data = {
    "2129013":
        {
            "name" : "Adwaith PJ",
            "major" : "Computer science",
            "section" : "CSCE",
            "branch" : "BTech",
            "starting_year" : 2021,
            "total_attendance" : 0,
            "standing" : "G",
            "year" : 4,
            "last_attendance_time" : "2022-12-11 00:54:34"
        },"2129011":
        {
            "name" : "Aditya Choudhury",
            "major" : "Computer science",
            "section" : "CSCE",
            "branch" : "BTech",
            "starting_year" : 2021,
            "total_attendance" : 0,
            "standing" : "G",
            "year" : 4,
            "last_attendance_time" : "2022-12-11 00:54:34"
        },"2129010":
        {
            "name" : "Aditya Singh",
            "major" : "Computer science",
            "section" : "CSCE",
            "branch" : "BTech",
            "starting_year" : 2021,
            "total_attendance" : 0,
            "standing" : "G",
            "year" : 4,
            "last_attendance_time" : "2022-12-11 00:54:34"
        },



}


for key,value in data.items():
    ref.child(key).set(value)