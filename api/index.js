const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { mongoose } = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const isValidUrl = require('valid-url');
const multer = require('multer')
const fs = require('fs')
const Place = require('./models/Place.js')
const Booking = require('./models/Booking.js')
const path = require('path');

const jwtSecret = 'dskdhsjdhsdjsd';

const app = express();

app.use(cookieParser());

app.use('/uploads',express.static(__dirname+'/uploads'))

app.use(express.json());

// const corsOptions = {
//     origin: ['http://localhost:5173','https://propsi-mern-app-lhx8.vercel.app'], // Allow requests from localhost:5173
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   };
  
  app.use(cors());

app.use((req, res, next) => {
    console.log('Cookies:', req.cookies);
    next();
});


mongoose.connect(process.env.MONGO_URL);

app.get('/', (req, res) => {
        res.json('test2');
});
  


app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,10),
        })
        res.json(userDoc);
    }catch(err){
        res.json({
            message:'error',
            err,
        })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const userDoc = await User.findOne({ email });
      if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
        const token = jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
            name: userDoc.name,
          },
          jwtSecret,
          {}
        );
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: true, // Set to true in production (requires HTTPS)
        });
         // res.json();
          res.status(200).json({ message: 'Success' },userDoc,token);
      } else {
        res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                res.status(401).json({ status: 'error', message: 'Unauthorized' });
            } else {
                const { name, email, _id } = await User.findById(user.id);
                res.json({ name, email, _id });
            }
        });
    } else {
        res.status(200).json({});
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});



app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;

    if (isValidUrl.isUri(link)) {
        const newName = 'photo' + Date.now() + '.jpg';

        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName
        });

        res.json(newName);
    } else {
        res.status(400).json({ error: 'Invalid URL' });
    }
});

const photosMiddleware = multer({dest:'uploads/'})

app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
    
    const uploadFiles = [];
    
    for(let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i]; 
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path+'.'+ext;
        fs.renameSync(path,newPath)
        console.log(newPath);
        uploadFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadFiles)
})


app.post('/places',(req,res)=>{
    const {token} = req.cookies;
    const {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkInTime,
        checkOutTime,
        maxGuest,
        price,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:user.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn:checkInTime,
            checkOut:checkOutTime,
            maxGuests:maxGuest,
            price
        }) 
        res.json(placeDoc)
    });
})

app.get('/user-places',async (req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;
        const {id} = user;
        res.json(await Place.find({owner:id}))
    });

})


app.get('/places/:id',async (req,res)=>{
    res.json(await Place.findById(req.params.id))
});

app.put('/places',async (req,res)=>{
    const {token} = req.cookies;
    const {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkInTime,
        checkOutTime,
        maxGuest,
        price
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(user.id === placeDoc.owner.toString()){
            placeDoc.set({
                title,
                address,
                photos:addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn:checkInTime,
                checkOut:checkOutTime,
                maxGuests:maxGuest,
                price
            });
            await placeDoc.save();
            res.json(placeDoc)
        }
    });
})

app.get('/places',async (req,res)=>{
    res.json(await Place.find())
})

app.post('/bookings', async (req, res) => {
    const { token } = req.cookies;
    const { place, checkIn, checkOut, guests, name, phone, price } = req.body;
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
  
      try {
        const booking = await Booking.create({
          place,
          user: user.id,
          checkIn,
          checkOut,
          guests,
          name,
          phone,
          price,
        });
        res.json(booking);
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    });
  });

app.get('/bookings', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const bookings = await Booking.find({ user: decoded.id }).populate('place');
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  });
//-----------------------------------
// const __dirname1 = path.resolve(__dirname);
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname1, 'client', 'dist')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'));
//     });
// } else {
//     app.get('/', (req, res) => {
//         res.json('test');
//     });
// }

//-----------------------------------

app.listen(4000,()=>{
    console.log('server on port 4000');
})
