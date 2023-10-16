from PIL import Image

image = Image.open(r"C:\Users\adwai\Downloads\IMG_20230807_143416.jpg")

# set new size
new_width = 261
new_height = 261

resized = image.resize((new_width, new_height), Image.LANCZOS)

resized.save(r"C:\Users\adwai\Downloads\Resized image\RESIZED.jpg")
