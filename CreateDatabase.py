from os import listdir
import json
from os.path import join, isfile

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
        
        jsonArray.append({
            'dirname': targetDir,
            'title': dir,
            'status': 'unfinished',
            'eps': episodes
        })

# print(jsonArray)
with open('DB.json', 'w+') as output:
    json.dump(jsonArray, output)