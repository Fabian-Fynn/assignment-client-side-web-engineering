import PouchDB from 'pouchdb'

const localDB = new PouchDB('mmt-ss2017')
const remoteDB = new PouchDB('https://couchdb.5k20.com/mmt-ss2017', {
    auth: {
        username: 'fhoffmann',
        password: 'test',
    }
})

// localDB.sync(remoteDB, {
//     // live: true,
// })

export default class Store {
    /**
     * @param {!string} name Database name
     * @param {function()} [callback] Called when the Store is ready
     */
    constructor(name, callback) {
        /**
         * @type {ItemList}
         */

        /**
         * Read the local ItemList from localStorage.
         *
         * @returns {ItemList} Current array of todos
         */
        this.getStore = () => {
            return new Promise((resolve, reject) => {
                localDB.allDocs({
                    include_docs: true,
                }).then((docs) => {
                    const todos = docs.rows.map((row) => {
                        return {
                            id: row.doc._id,
                            completed: row.doc.completed,
                            title: row.doc.title,
                            _rev: row.doc._rev,
                        }
                    })
                    resolve(todos);
                })
            })
        }

        if (callback) {
            callback();
        }

        /**
         * Write the local ItemList to localStorage.
         *
         * @param {ItemList} todos Array of todos to write
         */
        this.setStore = (todos) => {
        }

        if (callback) {
            callback()
        }
    }

    /**
     * Find items with properties matching those on query.
     *
     * @param {ItemQuery} query Query to match
     * @param {function(ItemList)} callback Called when the query is done
     *
     * @example
     * db.find({completed: true}, data => {
	 *	 // data shall contain items whose completed properties are true
	 * })
     */
    find(query, callback) {
        console.log('query :', query);

        this.getStore()
            .then((todos) => {
                console.log('todos :', todos);

                let result = ''

                result = todos.filter((todo) => {
                    for (let k in query) {
                        if (query[k] !== todo[k]) {
                            return false
                        }
                    }
                    return true
                })
                callback(result)
            })
    }

    /**
     * Update an item in the Store.
     *
     * @param {ItemUpdate} update Record with an id and a property to update
     * @param {function()} [callback] Called when partialRecord is applied
     */
    update(update, callback) {
        this.getStore().then(() => {
            localDB.get(update.id.toString())
                .then((doc) => {
                    return localDB.put({
                        _id: update.id.toString(),
                        _rev: doc._rev,
                        title: update.title,
                        completed: update.completed,
                    })
                })
                .then(callback())
        })
    }

    /**
     * Insert an item into the Store.
     *
     * @param {Item} item Item to insert
     * @param {function()} [callback] Called when item is inserted
     */
    insert(item, callback) {
        item._id = item.id.toString();

        localDB.put(item)
            .then(() => callback())
    }

    /**
     * Remove items from the Store based on a query.
     *
     * @param {ItemQuery} query Query matching the items to remove
     * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
     */
    remove(query, callback) {
        const removeByQuery = (ts) => {
            localDB.bulkDocs(ts.map((todo) => ({
                _id: todo._id,
                _rev: todo._rev,
                _deleted: true,
            })))
                .then(callback)

        }
        this.find(query, removeByQuery)
    }

    /**
     * Count total, active, and completed todos.
     *
     * @param {function(number, number, number)} callback Called when the count is completed
     */
    count(callback) {
        this.getStore().then(todos => {
            let compl = 0;
            todos.forEach((todo) => {
                if (todo.completed) {
                    compl += 1
                }
            })
            callback(todos.length, todos.length - compl, compl)
        })
    }
}
