const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const { selectById, removeById, merge, sortDB, sortEps } = require('./lib')
let db = require('./DB.json')

const targetDirs = ['E:/FILM/Anime', 'G:/Anime']
const API_SERVER = 'http://localhost:5000'

app.use(cors())

app.use(express.json())
for (const dir of targetDirs) {
    app.use('/library', express.static(dir))
}

app.get('/', (req, res) => {
    res.send('You\'re connected!')
})

app.get('/database', (req, res) => {
    const rawdata = fs.readFileSync('DB.json')
    const db = JSON.parse(rawdata)
    res.json(db)
})

app.get('/anime/v2/all', (req, res) => {

    const data = []

    for (let item of db) {
        if (fs.existsSync(path.join(item.dirname, item.title))) {
            let coverHttpPath
            if (fs.existsSync(path.join(item.dirname, item.title, 'folder.jpg'))) {
                coverHttpPath = API_SERVER + '/library/' + item.title + '/folder.jpg'
            } else {
                coverHttpPath = '/no-image.jpg'
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

app.post('/anime/v2/update/status', (req, res) => {

    const { id, status } = req.body
    const select = selectById(db, id)
    select.status = status
    
    const data = JSON.stringify(db, null, 4)
    console.log(data)
    fs.writeFileSync('DB.json', data, 'utf8')

    res.send('success')
})

app.post('/anime/v2/update/watched', (req, res) => {

    const { id, epIndex } = req.body
    const select = selectById(db, id)
    select.eps[epIndex].watched = !select.eps[epIndex].watched 
  
    const data = JSON.stringify(db, null, 4)
    fs.writeFileSync('DB.json', data, 'utf8')
    res.send('success')
})



app.listen(5000)