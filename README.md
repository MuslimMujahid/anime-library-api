# anime-library-api

## How To Use
- add your movie directories to **targetDirs**
- **MY_SERVER** is your server running the api
- **targetDirs** is path to your movie directories
- run `npm start`

## Request Explanation
- **http://YOUR_SERVER/anime/all** return json with parameters 
    - **titles** : array of anime titles (name of all dir in directrory specified) (string)
    - **covers** : path to image cover of respective title (string) (null if nothing found)

- **http://YOUR_SERVER/anime/:title** return json with parameters
    - **title** : title of anime directory being opened
    - **epsLink** : array of name of files in the directory being opened (string) 

- You can access your anime library directory from **http://YOUR_SERVER/library/**