const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const targetDirs = ['E:/FILM/Anime', 'G:/Anime']
const MY_SERVER = 'localhost:5000'

app.use(express.json())
for (const dir of targetDirs) {
    app.use('/library', express.static(dir))
}

app.use(cors())

app.get('/', (req, res) => {
    res.send('You\'re connected!')
})

app.get('/anime/all', (req, res) => {
    let titles = []
    let covers = []

    for (const dir of targetDirs) {
        if (fs.existsSync(dir)) {
            let dirTitles = fs.readdirSync(dir)
            
            dirTitles.forEach(title => {
                const coverPath = path.join(dir, title, 'folder.jpg')
                if (fs.existsSync(coverPath)) {
                    covers.push('http://' + path.join(`${MY_SERVER}/library`, title, 'folder.jpg'))
                } else {
                    covers.push(null)
                }
            })

            titles = titles.concat(dirTitles)
        }
    }

    res.json({
        'titles': titles,
        'covers': covers
    })
})

app.get('/anime/:title', (req, res) => {
    const { title } = req.params
    const AcceptedExtensions = ['mp4', 'mkv']

    let epsLink
    for (const dir of targetDirs) {

        const dirname = path.join(dir, title) 
        if (fs.existsSync(dirname)) {
            epsLink = fs.readdirSync(dirname)
            epsLink = epsLink.filter(eps => AcceptedExtensions.includes(eps.split('.').slice(-1)[0]))
            
        }
    }

    res.json({
        'title': title,
        'epsLink': epsLink
    })
})

app.listen(5000)