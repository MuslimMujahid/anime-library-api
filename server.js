const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
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

app.post('/database/update', (req, res) => {
    fs.writeFile('DB.json', JSON.stringify(req.body.data), () => {})
    res.send('Update Success')
})

app.get('/database', (req, res) => {
    const rawdata = fs.readFileSync('DB.json')
    const db = JSON.parse(rawdata)
    res.send(db)
})

// app.get('/anime/all', (req, res) => {
//     let titles = []
//     let covers = []

//     for (const dir of targetDirs) {
//         if (fs.existsSync(dir)) {
//             let dirTitles = fs.readdirSync(dir)
            
//             dirTitles.forEach(title => {
//                 const coverPath = path.join(dir, title, 'folder.jpg')
//                 if (fs.existsSync(coverPath)) {
//                     covers.push('http://' + path.join(`${API_SERVER}/library`, title, 'folder.jpg'))
//                 } else {
//                     covers.push(null)
//                 }
//             })

//             titles = titles.concat(dirTitles)
//         }
//     }

//     res.json({
//         'titles': titles,
//         'covers': covers
//     })
// })

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

// app.get('/anime/v2/all/:status', (req, res, next) => {

//     const { status } = req.params
//     const statusExpected = ['finished', 'unfinished', 'unwatched']

//     if (!statusExpected.includes(status)) {
//         res.send({})
//     } else {
//         const rawdata = fs.readFileSync('DB.json')
//         const db = JSON.parse(rawdata)
//         const dbFiltered = db.filter(item => item.status == status)
//         const data = []
//         for (let item of dbFiltered) {
//             if (fs.existsSync(path.join(item.dirname, item.title))) {
//                 let coverHttpPath
//                 if (fs.existsSync(path.join(item.dirname, item.title, 'folder.jpg'))) {
//                     coverHttpPath = API_SERVER + '/library/' + item.title + '/folder.jpg'
//                 } else {
//                     coverHttpPath = null
//                 }
//                 data.push({
//                     'title': item.title,
//                     'dirHttpPath': API_SERVER + '/library/' + item.title,
//                     'coverHttpPath': coverHttpPath,
//                     'status': item.status
//                 })
//             }
//         }
        
//         res.json({
//             'data': data
//         })
//     }
// })

// app.get('/anime/:title', (req, res) => {
//     const { title } = req.params
//     const AcceptedExtensions = ['mp4', 'mkv']

//     let epsLink
//     for (const dir of targetDirs) {

//         const dirname = path.join(dir, title) 
//         if (fs.existsSync(dirname)) {
//             epsLink = fs.readdirSync(dirname)
//             epsLink = epsLink.filter(eps => AcceptedExtensions.includes(eps.split('.').slice(-1)[0]))
            
//         }
//     }

//     res.json({
//         'title': title,
//         'epsLink': epsLink
//     })
// })

// app.get('/anime/v2/:title', (req, res) => {
//     const { title } = req.params
//     const AcceptedExtensions = ['mp4', 'mkv']

//     const rawdata = fs.readFileSync('DB.json')
//     const db = JSON.parse(rawdata)

//     const SelectByTitle = db.filter(item => item.title == title)[0]

//     const data = [] 
//     for (let item of SelectByTitle.eps) {
//         data.push({
//             'filename': item.epTitle,
//             'epHttpPath': API_SERVER + '/library/' + title + '/' + item.epTitle,
//             'watched': item.watched
//         })
//     }
//     res.json({
//         'data': data
//     })
// })

app.post('/anime/v2/update/status', (req, res) => {
    const { title, status } = req.body
    let SelectByTitle = db.filter(item => item.title == title)[0]
    db = db.filter(item => item.title != title)
    SelectByTitle.status = status
    db = [SelectByTitle, ...db]
    db = db.sort((a, b) => { return (a.title > b.title ? 1 : -1) })
    const data = JSON.stringify(db, null, 4)
    fs.writeFile('DB.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.")
    })

    res.json(db)
})

app.post('/anime/v2/update/watched', (req, res) => {
    const { title, epTitle } = req.body
    let SelectByTitle = db.filter(item => item.title == title)[0]
    db = db.filter(item => item.title != title)
    let selectByEpTitle = SelectByTitle.eps.filter(ep => ep.epTitle == epTitle)[0]
    SelectByTitle.eps = SelectByTitle.eps.filter(ep => ep.epTitle != epTitle)
    selectByEpTitle.watched = !selectByEpTitle.watched 
    SelectByTitle.eps = [...SelectByTitle.eps, selectByEpTitle]
    SelectByTitle.eps = SelectByTitle.eps.sort((a, b) => { return (a.epTitle > b.epTitle ? 1 : -1) })
    
    if (SelectByTitle.eps.filter(ep => ep.watched == false).length == 0) {
        SelectByTitle.status = 'finished'
    } else if (SelectByTitle.eps.filter(ep => ep.watched == true).length == 0) {
        SelectByTitle.status = 'unwatched'
    } else {
        SelectByTitle.status = 'unfinished'
    }

    db = [...db, SelectByTitle]
    db = db.sort((a, b) => { return (a.title > b.title ? 1 : -1) })
    const data = JSON.stringify(db, null, 4)
    fs.writeFile('DB.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.")
    })
    res.send('success')
})

app.listen(5000)