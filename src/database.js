const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/galler_photos_db',{
    useNewUrlParser: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));