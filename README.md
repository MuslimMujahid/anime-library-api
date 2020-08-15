# anime-library-api

## How To Use
- change **MY_SERVER** and **targetDir** values in **server.js**
- **MY_SERVER** is your server running the api
- **targetDir** is your anime library directory
- run `npm start`

## Request Explanation
- **http://YOUR_SERVER/anime/all** return json with parameters 
    - **dirname** : static path in server to the anime library folder
    - **titles** : array of anime titles (name of all dir in directrory specified) (string)
    - **covers** : static path for image cover of respective title (null if nothing found)

- **http://YOUR_SERVER/anime/:title** return json with parameters
    - **dirname** : static path in server to the particular anime directory with title(:title)
    - **title** : title of anime directory being opened
    - **epsLink** : array of name of files in the directory being opened (string) 

- You can access your anime library directory from **http://YOUR_SERVER/library/**