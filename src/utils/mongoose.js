module.exports = {
    multipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongoose => {
            if (mongoose.toObject) {
                return mongoose.toObject()
            }
            return mongoose
        })
    },
    mongooseToObject: function (mongoose) {
        return mongoose.toObject ? mongoose.toObject() : mongoose
    }
}