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
    const { producto, marca,stock,precio } = req.body;
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    
    const newPhoto = new Photo({
        producto: producto,
        marca: marca,
        stock: stock,
        precio:precio,
        imageURL: result.url,
        public_id: result.public_id
    });

    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

/*
router.get("/images/edit/:photo_id", (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) =>{
        if(err){
            res.redirect('/')
        } else {
            if(producto == null){
                res.redirect('/');
            }else{
                res.render('edit_productos', {
                    title: 'Editar Producto',
                    producto: producto,
                })
            }
        }
    })
});

router.post('/images/update/:photo_id', upload, (req,res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image); 
        } catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    Producto.findByIdAndUpdate(id, {
        producto: req.body.producto,
        marca: req.body.marca,
        tipo: req.body.tipo,
        stock: req.body.stock,
        precio: req.body.precio,
        image: new_image,
    }, (err, result) =>{
        if(err){
            res.json({ message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Producto Actualiado Correctamente!',
            };
            res.redirect('/');
        }
    })
});
*/
router.get('/images/delete/:photo_id', async (req, res) => {
    const { photo_id }= req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    console.log(result);
    res.redirect('/images/add')
});

module.exports = router;