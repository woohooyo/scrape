// product
db.product.createIndex({batchId : -1, productId : 1}, {background : true}, {unique: true});
db.product.createIndex({createdAt: 1}, {expireAfterSeconds: 1000 * 60 * 60 * 12});
db.product.createIndex({sellerId: -1}, {background : true});
db.product.createIndex({batchId: -1}, {background : true});

// queue
db.queue.createIndex({createdAt: 1}, {expireAfterSeconds: 1000 * 60 * 60 * 4});

// userAuth
db.userAuth.createIndex({username: 1, isDeleted: 1}, {background : true}, {unique: true})
