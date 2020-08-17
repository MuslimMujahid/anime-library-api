const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const targetDirs = ['E:/FILM/Anime', 'G:/Anime']
const API_SERVER = 'http://localhost:5000'

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

app.get('/anime/v2/all', (req, res) => {

    const rawdata = fs.readFileSync('DB.json')
    const db = JSON.parse(rawdata)

    const data = []

    for (let item of db) {
        if (fs.existsSync(path.join(item.dirname, item.title))) {
            let coverHttpPath
            if (fs.existsSync(path.join(item.dirname, item.title, 'folder.jpg'))) {
                coverHttpPath = API_SERVER + '/library/' + item.title + '/folder.jpg'
            } else {
                coverHttpPath = null
            }
            data.push({
                'title': item.title,
                'dirHttpPath': API_SERVER + '/library/' + item.title,
                'coverHttpPath': coverHttpPath,
                'status': item.status
            })
        }
    }
    
    res.json({
        'data': data
    })
})

app.get('/anime/v2/all/:status', (req, res, next) => {

    const { status } = req.params
    const statusExpected = ['finished', 'unfinished', 'unwatched']

    if (!statusExpected.includes(status)) {
        res.send({})
    } else {
        const rawdata = fs.readFileSync('DB.json')
        const db = JSON.parse(rawdata)
        const dbFiltered = db.filter(item => item.status == status)
        const data = []
        for (let item of dbFiltered) {
            if (fs.existsSync(path.join(item.dirname, item.title))) {
                let coverHttpPath
                if (fs.existsSync(path.join(item.dirname, item.title, 'folder.jpg'))) {
                    coverHttpPath = API_SERVER + '/library/' + item.title + '/folder.jpg'
                } else {
                    coverHttpPath = null
                }
                data.push({
                    'title': item.title,
                    'dirHttpPath': API_SERVER + '/library/' + item.title,
                    'coverHttpPath': coverHttpPath,
                    'status': item.status
                })
            }
        }
        
        res.json({
            'data': data
        })
    }
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

app.get('/anime/v2/:title', (req, res) => {
    const { title } = req.params
    const AcceptedExtensions = ['mp4', 'mkv']

    const rawdata = fs.readFileSync('DB.json')
    const db = JSON.parse(rawdata)

    const SelectByTitle = db.filter(item => item.title == title)[0]

    const data = [] 
    for (let item of SelectByTitle.eps) {
        data.push({
            'filename': item.epTitle,
            'epHttpPath': API_SERVER + '/library/' + title + '/' + item.epTitle
        })
    }
    res.json({
        'data': data
    })
})

app.listen(5000)