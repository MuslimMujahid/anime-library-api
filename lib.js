const selectById = (db, id) => {
    const select = db.filter(item => item.id == id)[0]
    return select
}

const removeById = (db, id) => {
    return db.filter(item => item.id !== id)
}

const sortDB = (db) => {
    return db.sort((a, b) => a.id > b.id ? 1 : -1)
}

const sortEps = (eps) => {
    return eps.sort((a, b) => a.epTitle > b.epTitle ? 1 : -1)
}

const merge = (db, select) => {
    return [...db, select]
}

module.exports = { selectById, removeById, merge, sortDB, sortEps }