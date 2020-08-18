from os import listdir
import json
from os.path import join, isfile, exists
import operator

targetDirs = ['E:/FILM/Anime', 'G:/Anime']

jsonArray = []

videoExtensions = ['mp4', 'mkv']
for targetDir in targetDirs:
    dirs = listdir(targetDir)
    dirs = [dir for dir in dirs if (not isfile(join(targetDir, dir)))]

    for dir in dirs:
        files = listdir(join(targetDir, dir))
        files = [file for file in files if (isfile(join(targetDir, dir, file)))]
        files = [file for file in files if file.split('.')[-1] in videoExtensions] 

        episodes = []
        for file in files:
            episodes.append({
                'epTitle': file,
                'watched': False 
            })
        
        cover = False
        if exists(join(targetDir, dir, 'folder.jpg')):
            cover = True

        jsonArray.append({
            'dirname': targetDir,
            'title': dir,
            'status': 'unwatched',
            'eps': episodes,
            'cover': cover
        })

jsonArray = sorted(jsonArray, key=lambda k: k['title'])
for (id, item) in enumerate(jsonArray):
    item.update({'id': id})

# print(jsonArray)
with open('DB.json', 'w+') as output:
    json.dump(jsonArray, output)