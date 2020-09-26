const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const Music = require('../models/mp3');
const { json } = require('body-parser');

// Upload storage location
const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        if (file.fieldname === 'featured_img') {
            cd(null, './assets/uploads/featured-img');
        }

        else if (file.fieldname === 'audio') {
            cd(null, './assets/uploads/audio-file');
        }
    },

    filename: function (req, file, cd) {
      cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

//insert
const cpUpload = upload.fields([{ name: 'featured_img', maxCount: 1}, { name: 'audio', maxCount: 1}]);
router.post('/', cpUpload, async (req, res) => {
    const featured_img = req.body.featured_img;
    const title = req.body.title;
    const band_name = req.body.band_name;
    const audio = req.body.audio;
    const music = new Music({
        featured_img: featured_img,
        title: title,
        band_name: band_name,
        audio: audio,
    });

    try {
        const new_music = await music.save();
        res.json(new_music);
    } catch (error) {
        res.send('Error ' + error);
    }
});

//get all data
router.get('/', async (req, res) => {
    try {
        const musics = await Music.find();
        res.json(musics);
    } catch (error) {
        res.send('Error ' + error);
    }
});

//Get single data
// router.get('/:id', async (req, res) => {
//     try {
//         const musics = await Music.findById(req.params.id);
//         res.json(musics);
//     } catch (error) {
//         res.send('Error ' + error);
//     }
// });

//update
// router.patch('/:id', async (req, res) => {
//     try {
//         const musics = await Music.findById(req.params.id);
//         musics.content = req.body.content;
//         const updated_blog = await musics.save();
//         res.json(updated_blog);
//     } catch (error) {
//         res.send('Error ' + error);
//     }
// });
//delet
// router.delete('/:id', async (req, res) => {
//     try {
//         const musics = await Music.findById(req.params.id);
//         const remove_music = await musics.remove();
//         res.json(remove_music);
//     } catch (error) {
//         res.send('Error ' + error);
//     }
// });

module.exports = router;