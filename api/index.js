const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const isValidUrl = require('valid-url');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const path = require('path');

const jwtSecret = 'dskdhsjdhsdjsd';

const app = express();

app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173', 'https://propsi-mern-app-lhx8.vercel.app'], // Allow requests from localhost:5173
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URL);

app.get('/', (req, res) => {
  res.json('test2');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.json(userDoc);
  } catch (err) {
    res.json({
      message: 'error',
      err,
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the password
    const isValidPassword = bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }
    // If the user and password are valid, create a JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    res.status(200).json({ token, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/profile', (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
      } else {
        const { name, email, _id } = await User.findById(user.userId);
        res.json({ name, email, _id });
      }
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;

  if (isValidUrl.isUri(link)) {
    const newName = 'photo' + Date.now() + '.jpg';

    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });

    res.json(newName);
  } else {
    res.status(400).json({ error: 'Invalid URL' });
  }
});

app.get('uploads/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
})

const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    console.log(newPath);
    uploadFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadFiles);
});

app.post('/places', (req, res) => {
  const {token} = req.body;
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
  console.log("The token is from post : ",token);
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    console.log("The user is from post : ",user);
    const placeDoc = await Place.create({
      owner: user.userId,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      maxGuests: maxGuest,
      price,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', async (req, res) => {
    const token = req.headers.authorization;
    console.log(token);
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const id = user.userId;
    console.log(user);
    res.json(await Place.find({owner:id}));
  });
});

app.get('/places/:id', async (req, res) => {
  res.json(await Place.findById(req.params.id));
});

app.put('/places', async (req, res) => {
  const {token} = req.body;
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
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);

    if (user.userId === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        maxGuests: maxGuest,
        price,
      });
      await placeDoc.save();
      res.json(placeDoc);
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  const {token} = req.body;
  const { place, checkIn, checkOut, guests, name, phone, price } = req.body;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized 2' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
      const booking = await Booking.create({
        place,
        user: user.userId,
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
      res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' });
    }
  });
});

app.get('/bookings', async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized 2' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const bookings = await Booking.find({ user: decoded.userId }).populate(
      'place'
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

app.listen(4000, () => {
  console.log('server on port 4000');
});
