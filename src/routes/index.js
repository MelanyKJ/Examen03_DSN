const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    const photos = await Photo.find();
    //console.log(photos);
    res.render('images', {photos});
});

router.get('/images/add', async (req, res) => {
    const photos = await Photo.find();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req, res) => {
    console.log(req.body);
    const { producto, marca,stock,precio, tipo} = req.body;
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    
    const newPhoto = new Photo({
        producto: producto,
        marca: marca,
        stock: stock,
        tipo: tipo,
        precio:precio,
        imageURL: result.url,
        public_id: result.public_id
    });

    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

//EDITAR


router.get("/images/edit/:photo_id", async (req, res) => {
    const photo = await Photo.findById(req.params.photo_id);

    res.render('image_edit',{photo})
});

router.post('/images/edit/:photo_id', async (req, res) => {
    const { photo_id }= req.params;
    const { producto, marca, tipo, stock, precio, imageURL } = req.body;
    const photo_up = await Photo.findById(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo_up.public_id);
    
    const resultup = await cloudinary.v2.uploader.upload(req.file.path);

    const photo = await Photo.findByIdAndUpdate(photo_id, {
        producto: producto,
        marca: marca,
        tipo: tipo,
        stock: Number(stock),
        precio: Number(precio),
        imageURL: resultup.url,
        public_id: resultup.public_id
    }, {
        new: true
    });
    
    res.redirect('/')
});


router.get('/images/delete/:photo_id', async (req, res) => {
    const { photo_id }= req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    console.log(result);
    res.redirect('/')
});

module.exports = router;