const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const targetDir = 'E:/FILM/Anime'
const MY_SERVER = 'localhost:5000'

app.use(express.json())
app.use('/library', express.static(targetDir))
app.use(cors())

app.get('/', (req, res) => {
    res.send('You\'re connected!')
})

app.get('/anime/all', (req, res) => {
    const titles = fs.readdirSync(targetDir)
    const covers = []

    titles.forEach(title => {
        const coverPath = path.join(targetDir, title, 'folder.jpg')
        if (fs.existsSync(coverPath)) {
            covers.push('http://' + path.join(`${MY_SERVER}/library`, title, 'folder.jpg'))
        } else {
            covers.push(null)
        }
    })
    res.json({
        'dirname': targetDir,
        'titles': titles,
        'covers': covers
    })
})

app.get('/anime/:title', (req, res) => {
    const { title } = req.params
    const AcceptedExtensions = ['mp4', 'mkv']
    const dirname = path.join(targetDir, title) 
    let epsLink = fs.readdirSync(dirname)
    epsLink = epsLink.filter(eps => AcceptedExtensions.includes(eps.split('.').slice(-1)[0]))

    res.json({
        'dirname': dirname,
        'title': title,
        'epsLink': epsLink
    })
})

app.listen(5000)