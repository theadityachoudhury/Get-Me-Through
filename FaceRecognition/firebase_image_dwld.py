import firebase_admin
from firebase_admin import credentials, storage
import os

# Set up the credentials and initialize the app
cred = credentials.Certificate("serviceAccountKey.json")  # Replace with your service account key path
firebase_admin.initialize_app(cred, {
    'storageBucket': "faceattendancerealtime-a8bc3.appspot.com"  # Replace with your bucket name
})


# Download content from Firebase Storage
def download_from_storage(storage_path, local_folder_path):
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=storage_path)  # List all blobs in the folder

    for blob in blobs:
        if '.' in blob.name:
            file_path = os.path.join(local_folder_path, os.path.basename(blob.name))
            blob.download_to_filename(file_path)
            print(f'File {blob.name} downloaded to {file_path}.')


# Usage example
storage_path = 'Images/'  # Replace with the path to your folder in Firebase Storage
local_folder_path = r"D:\PROGRAMMING\PROJECTS\Student Participation Tracker\FaceRecognition\Images"
# Replace with the desired local folder path

download_from_storage(storage_path, local_folder_path)
