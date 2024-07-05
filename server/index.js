const bcrypt =require("bcrypt");
const express=require('express');
const app=express();
const mysql=require('mysql');
const cors=require('cors');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer =require('multer');
const path = require('path');
const {exec}=require('child_process');
const fs = require('fs');
require('dotenv').config();
const util = require('util');
const execPromise = util.promisify(exec);
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



app.use(cors());
app.use(cookieParser());
app.use(express.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});




const FRONTEND_URL=process.env.FRONTEND_URL;

app.get('/', (req, res) => {
  res.send('Hello');
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary where files will be stored
    format: async (req, file) => 'jpeg', // Format of the uploaded file
    public_id: (req, file) => Date.now() + file.originalname, // Custom filename
  },
});
const upload =multer({storage})


app.post('/upload', upload.single('file'), function (req, res) {
  
  const file = req.file;
  res.status(200).json(file.path); // Cloudinary URL of the uploaded file
});

app.post('/server/upload', upload.single('file'), function (req, res, ) {
    const file=req.file;
    res.status(200).json(file.filename)
   
  })

app.post("/register",(req,res)=>{
    const q="SELECT * from user WHERE email=? OR username=?"
    db.query(q,[req.body.email,req.body.username],(err,data)=>{
       if (err) return res.status(500).json({ error: "Internal Server Error" });
       if (data.length) return res.status(409).json("User already exists");


       const salt=bcrypt.genSaltSync(10);
       const hash=bcrypt.hashSync(req.body.password,salt);
       const insertQuery="INSERT INTO user(`username`,`email`,`password`) VALUES (?, ?, ?)";
       const values=[
           req.body.username,
           req.body.email,
           hash,
       ];
       db.query(insertQuery, values, (err, data) => {
           if (err) return res.status(500).json({ error: "Internal Server Error" });
           return res.status(200).json("User has been created");
       });
    });
   });

   app.post('/login', (req, res) => {
    const q = "SELECT * FROM user WHERE username=?"
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!")

        const token = jwt.sign({ id: data[0].iduser }, "jwtkey")
        const { password, ...other } = data[0]
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).status(200).json(other);
    })
});

app.post('/adminlogin', (req, res) => {
  const q = "SELECT * FROM admin WHERE adminname=?"
  db.query(q, [req.body.username], (err, data) => {
      if (err) return res.json(err);
      if (data.length === 0) return res.status(404).json("User not found!")

      const token = jwt.sign({ id: data[0].idadmin }, "jwtkey")
      const { password, ...other } = data[0]
      res.cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
      }).status(200).json(other);
  })
});

app.post('/logout',(req,res)=>{
    res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
 }).status(200).json("user has been logged out.");

    
})

app.post('/adminlogout',(req,res)=>{
  res.clearCookie("access_token",{
  sameSite:"none",
  secure:true
}).status(200).json("user has been logged out.");

  
})

app.post("/home",(req,res)=>{
    console.log(req.body);
    const q="Update home SET heading =? ,description=? Where idhome=?"
    const val=[req.body.heading,req.body.paragraph,1]
    db.query(q, val, (err, data) => {
      if (err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } 
      return res.status(200).json("User has been created");
  });
  
  })

  
  app.post("/feature", (req, res) => {
    
    const { id,heading, actualPrice, presentPrice, quantity, img, description,genre} = req.body;
    
    // Insert into the `features` table
    const featureQuery = "INSERT INTO all_books (book_id,heading, actual_price, present_price, quantity, img, description,genre,category) VALUES (?,?, ?, ?, ?, ?, ?,?,?)";
    const featureValues = [id,heading, actualPrice, presentPrice, quantity, img, description,genre,"features"];
    db.query(featureQuery, featureValues, (err, featureResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      
    });
  });
  app.post("/arrival", (req, res) => {
    const {id, heading, actualPrice, presentPrice, quantity, img, description,arrivalgenre } = req.body;
    console.log(arrivalgenre);
    // Insert into the `features` table
    const featureQuery = "INSERT INTO all_books (book_id,heading, actual_price, present_price, quantity, img, description,genre,category) VALUES (?,?, ?, ?, ?, ?, ?,?,?)";
    const featureValues = [id,heading, actualPrice, presentPrice, quantity, img, description,arrivalgenre,"arrivals"];
    db.query(featureQuery, featureValues, (err, featureResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      
    });
  });

  app.get('/getfeature', (req, res) => {
    const query = 'SELECT * FROM all_books WHERE category = "features"';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      res.json(result);
    });
  });
  app.get('/gethomepage', (req, res) => {
    const query = 'SELECT * FROM home';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(result);
    });
  });


  app.get('/getarrival', (req, res) => {
    const query = 'SELECT * FROM all_books WHERE category = "arrivals"';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(result);
    });
  });
  
  

  app.delete('/deletecategory/:id', (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE all_books SET category = NULL WHERE book_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    });
});

  
 
  

  app.get('/generalsettings', (req, res) => {
    const query = 'SELECT * FROM settings';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      res.json(result);
    });
  });

  app.post("/updategeneralsettings",(req,res)=>{
    console.log(req.body);
    const q="UPDATE settings SET site_title = ?, site_about = ? WHERE `s.no` = ?";
    const val=[req.body.heading,req.body.paragraph,1]
    db.query(q, val, (err, data) => {
      if (err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } 
      return res.status(200).json("User has been created");
  });
  
  })

  {/*shutdown*/}

  app.post('/shutdown',(req,res)=>{
    const q="UPDATE settings SET shutdown= ? WHERE `s.no` = ?";
    const val=[req.body.shutdown,1];
    db.query(q, val, (err, data) => {
      if (err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } 
      return res.status(200).json("shutdowned");
    });
    
    
    
  })

  app.get('/contactdetails', (req, res) => {
    const query = 'SELECT * FROM contact_details';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      res.json(result);
    });
  });

  app.post("/updatecontactdetails", (req, res) => {
    const q = "UPDATE contact_details SET address = ?, gmap = ?, pn1 = ?, pn2 = ?, email = ?, fb = ?, insta = ?, tw = ?, iframe = ? WHERE `s.no` = ?";
    const val = [
        req.body.address,
        req.body.gmap,
        req.body.pn1,
        req.body.pn2,
        req.body.email,
        req.body.fb,
        req.body.insta,
        req.body.tw,
        req.body.iframe,
        1 // Assuming you want to update the row with `s.no` = 1
    ];
    db.query(q, val, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json("Contact details have been updated");
    });
});


  
app.post("/allbooks", (req, res) => {
    
  const { id,heading, actualPrice, presentPrice, quantity, img, description,genre} = req.body;
  
  // Insert into the `features` table
  const featureQuery = "INSERT INTO all_books (book_id,heading, actual_price, present_price, quantity, img, description,genre) VALUES (?,?, ?, ?, ?, ?, ?,?)";
  const featureValues = [id,heading, actualPrice, presentPrice, quantity, img, description,genre];
  db.query(featureQuery, featureValues, (err, featureResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    
  });
});
  

app.get('/getallbooks', (req, res) => {
  const query = 'SELECT * FROM all_books';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.delete('/deleteallbooks/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM all_books WHERE book_id = ?';
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Row deleted successfully' });
  });
});

app.get('/singlebooks/:id', (req, res) => {

  const query = 'SELECT * FROM all_books WHERE book_id=?' ;
  const id = req.params.id;
  db.query(query,[id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.post('/comments', (req, res) => {
  const { bookid, userid, ratings, comment ,date} = req.body;
  db.query('INSERT INTO comments (bookid, userid, ratings, comment,date) VALUES (?, ?, ?, ?,?)',
    [bookid, userid, ratings, comment,date],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to insert comment' });
      } else {
        res.status(200).json({ message: 'Comment inserted successfully' });
      }
    }
  );
});



app.get('/getcomments/:id', (req, res) => {
  const query = 'SELECT c.*, u.username FROM comments c JOIN user u ON c.userid = u.iduser WHERE c.bookid = ?';
  const id = req.params.id;
  db.query(query,[id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});
app.delete('/deletecomments/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM comments WHERE idcomments= ?';
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Row deleted successfully' });
  });
});

app.post("/addtocart", (req, res) => {
  const { id, userid, bookid, heading, price, quantity, img } = req.body;

  // Check if the combination of userid and bookid already exists
  const checkQuery = `
    SELECT idcart, quantity
    FROM carts
    WHERE iduser = ? AND idbook = ?`;

  db.query(checkQuery, [userid, bookid], (err, checkResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let featureQuery, featureValues;

    if (checkResult.length > 0) {
      // Combination already exists, update the quantity
      const updatedQuantity = parseInt(checkResult[0].quantity) + parseInt(quantity);
      featureQuery = `
        UPDATE carts
        SET quantity = ?
        WHERE idcart = ?`;
      featureValues = [updatedQuantity, checkResult[0].idcart];
    } else {
    
      featureQuery = `
        INSERT INTO carts (idcart, iduser, idbook, heading, img, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      featureValues = [id, userid, bookid, heading, img, price, quantity];
    }

    // Execute the query
    db.query(featureQuery, featureValues, (err, featureResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Provide a more informative response based on affected rows
      const message = checkResult.length > 0
        ? 'Item quantity updated in cart'
        : 'Item added to cart';

      res.status(200).json({ message });
    });
  });
});




app.get('/getcart/:id', (req, res) => {
  const query = 'SELECT * FROM carts WHERE iduser=? ' ;
  const id = req.params.id;
  db.query(query,[id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.delete('/deletecart/:userid/:bookid', (req, res) => {
  const userId = req.params.userid;
  const bookId = req.params.bookid;

  const query = 'DELETE FROM cartS WHERE iduser = ? AND idbook = ? ';

  db.query(query, [userId,bookId], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Row deleted successfully' });
});
});

app.post("/addtowishlist", (req, res) => {
  const { id, userid, bookid, heading, price, quantity, img } = req.body;

  // Check if the combination of userid and bookid already exists
  const checkQuery = `
    SELECT idwishlist, quantity
    FROM wishlist
    WHERE iduser = ? AND idbook = ?`;

  db.query(checkQuery, [userid, bookid], (err, checkResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let featureQuery, featureValues;

    if (checkResult.length > 0) {
      // Combination already exists, update the quantity
      const updatedQuantity = parseInt(checkResult[0].quantity) + parseInt(quantity);
      featureQuery = `
        UPDATE wishlist
        SET quantity = ?
        WHERE idwishlist = ?`;
      featureValues = [updatedQuantity, checkResult[0].idwishlist];
    } else {
      // Combination does not exist, insert a new row
      featureQuery = `
        INSERT INTO wishlist (idwishlist, iduser, idbook, heading, img, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      featureValues = [id, userid, bookid, heading, img, price, quantity];
    }

    // Execute the query
    db.query(featureQuery, featureValues, (err, featureResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Provide a more informative response based on affected rows
      const message = checkResult.length > 0
        ? 'Item quantity updated in cart'
        : 'Item added to cart';

      res.status(200).json({ message });
    });
  });
});



app.get('/getwishlist/:id', (req, res) => {
  const query = 'SELECT * FROM wishlist WHERE iduser=?  ' ;
  const id = req.params.id;
  db.query(query,[id,true], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.delete('/deletewishlist/:userid/:bookid', (req, res) => {
  const userId = req.params.userid;
  const bookId = req.params.bookid;
  const deleteQuery = 'DELETE FROM wishlist WHERE iduser = ? AND idbook = ? ';
 
  
  db.query(deleteQuery, [userId, bookId], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error(deleteErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: 'Row deleted successfully' });
    }
  });
});

app.put("/updatewishlist/:bookid/:userid", (req, res) => {
  const idbook = req.params.bookid;
  const iduser=req.params.userid;
  const { newQuantity } = req.body;
  console.log("hello");

  const updateQuery = `
    UPDATE wishlist
    SET quantity = ?
    WHERE idbook = ? and iduser=?`;

  db.query(updateQuery, [newQuantity, idbook,iduser], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({ message: "Cart item quantity updated successfully" });
  });
});

app.put("/updatecart/:bookid/:userid", (req, res) => {
  const idbook = req.params.bookid;
  const iduser=req.params.userid;
  const { newQuantity } = req.body;
  console.log("hello");

  const updateQuery = `
    UPDATE carts
    SET quantity = ?
    WHERE idbook = ? and iduser=?`;

  db.query(updateQuery, [newQuantity, idbook,iduser], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({ message: "Cart item quantity updated successfully" });
  });
});

// Backend route to get average rating and number of users who rated a book
app.get('/book/:id/rating', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT 
      AVG(ratings) AS averageRating,
      COUNT(DISTINCT userid) AS numUsersRated
    FROM 
      comments
    WHERE 
      book_id = ?`;

  db.query(query, [bookId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const { averageRating, numUsersRated } = result[0];
    res.status(200).json({ averageRating, numUsersRated });
  });
});
app.post('/orders', async (req, res) => {
  const { userId, items ,totalAmount,address } = req.body;
  console.log(items);
  try {
    const values = items.map(item => [userId, item.bookId, item.quantity, totalAmount, address]);
    const sql = `INSERT INTO \`order\` (userId, bookId, quantity, totalAmount, address) VALUES ?`; // Fixed missing closing parenthesis
    await db.query(sql, [values]);

    res.status(201).send('Order placed successfully');
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /feedback
app.post('/feedback', async (req, res) => {
  const { feedback, rating ,userid} = req.body;
  try {
    await db.query('INSERT INTO feedback (feedback, ratings,username) VALUES (?, ?,?)', [feedback, rating,userid]);
    res.status(201).send('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch all orders with book details
  

app.get('/getorders', async (req, res) => {
  const query = 'SELECT o.userId, GROUP_CONCAT(b.heading) AS books, SUM(o.quantity) AS quantity, MAX(o.totalAmount) AS totalAmount, MAX(o.address) AS address FROM `order` o JOIN `all_books` b ON o.bookid = b.book_id GROUP BY o.userId';


  await db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});


const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
    
  }
})

const uploadbook=multer({storage:store}).single('file')


app.post('/addBookToMainPage', (req, res) => {
  uploadbook(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Failed to upload file' });
    } else {
      const pdfPath = req.file.path;
      const outputDir = 'uploads/'; // Temporary output directory for images
      const outputBaseName = path.basename(pdfPath, path.extname(pdfPath));
      const imagePaths = [];
      const requestId = Date.now(); // Unique ID for this request

   
      

      const options = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: outputBaseName,
        page: null
      };

      try {
        await convertPdfToImages(outputDir, outputBaseName, pdfPath);

        const files = await fs.promises.readdir(outputDir);
        for (const file of files) {
          if (file.startsWith(outputBaseName) && !file.endsWith('pdf')) {
            const imagePath = path.join(outputDir, file);
            const uploadResponse = await cloudinary.uploader.upload(imagePath, {
              folder: 'book_images', // Cloudinary folder
              public_id: path.basename(imagePath, path.extname(imagePath))
            });
            imagePaths.push(uploadResponse.secure_url);
            await fs.promises.unlink(imagePath); // Delete local file after uploading
          }
        }

        const imagePathsJson = JSON.stringify(imagePaths);
        await db.query('INSERT INTO freebook (idfreebook, imgurl) VALUES (?, ?)', [requestId, imagePathsJson]);
        res.status(200).json({ requestId });

      } catch (error) {
        console.error('Error converting PDF to images:', error);
      } finally {
        await fs.promises.unlink(pdfPath); // Delete the local PDF file
      }
    }
  });
});


async function convertPdfToImages(outputDir, outputBaseName, pdfPath) {
  try {
    const { stdout, stderr } = await execPromise(`magick convert ${pdfPath} -quality 100 ${outputDir}/${outputBaseName}-%03d.jpg`);
    if (stderr) {
      console.error('Error:', stderr);
    } else {
      console.log('Success:', stdout);
    }
  } catch (error) {
    console.error('Exec error:', error);
  }
}


// Assuming you have already set up your MySQL connection and Express app
app.put('/freebook', (req, res) => {
  const { bookName,id } = req.body;

  const updateQuery = 'UPDATE freebook SET bookname = ? WHERE idfreebook = ?';
  db.query(updateQuery, [bookName, id], (err, result) => {
    if (err) {
      console.error('Error updating book details:', err);
      return res.status(500).json({ error: 'Database error while updating book details' });
    }

    // Fetch updated book details
    const fetchQuery = 'SELECT * FROM freebook WHERE idfreebook = ?';
    db.query(fetchQuery, [id], (err, results) => {
      if (err) {
        console.error('Error fetching updated book details:', err);
        return res.status(500).json({ error: 'Database error while fetching updated book details' });
      }

      res.json(results[0]);
    });
  });
});



// Endpoint for retrieving a book by requestId
app.get('/booksforfree/:requestId', async (req, res) => {
  const requestId = req.params.requestId;

  // Retrieve the book from the database
  try {
    const result = await db.query(
      'SELECT * FROM freebook WHERE idfreebook = ?',
      [requestId]
    );

    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error retrieving book:', error);
    res.status(500).json({ error: 'Failed to retrieve book' });
  }
});


app.get('/readingbooks', (req, res) => {
  let sql = `SELECT idfreebook, bookname, imgurl FROM freebook LIMIT 6`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    // Process the result to include only the first image
    const books = result.map(book => ({
      id: book.idfreebook,
      bookname: book.bookname,
      imgurl: JSON.parse(book.imgurl)[0]
    }));
    

    res.json(books);
  });
});

app.get('/allreadingbooks', (req, res) => {
  let sql = `SELECT idfreebook, bookname, imgurl FROM freebook`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    // Process the result to include only the first image
    const books = result.map(book => ({
      id: book.idfreebook,
      bookname: book.bookname,
      imgurl: JSON.parse(book.imgurl)[0]
    }));
    

    res.json(books);
  });
});

app.post('/singlefreebook', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send({ error: 'Book ID is required' });
  }

  const query = 'SELECT * FROM freebook WHERE idfreebook = ?'; // Assuming you have a 'free' column to check if the book is free

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).send({ error: 'Book not found' });
    }

    res.send(results[0]);
  });
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { userid, products, address, location } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: 'inr',
      product_data: { name: product.heading },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/paymentSuccesfull`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });
    console.log(products,userid,location,address);
    const values = products.map(item => [userid, item.idbook, item.quantity, item.price, address]);
    const sql = `INSERT INTO \`order\` (userId, bookId, quantity, totalAmount, address) VALUES ?`; // Fixed missing closing parenthesis
    await db.query(sql, [values]);

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deletefreebooks/:id', (req, res) => {
  const id = req.params.id;

  // Query the database to get the file names associated with the book
  const selectQuery = 'SELECT imgurl FROM freebook WHERE idfreebook = ?';
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const filesToDelete = JSON.parse(results[0].imgurl); // assuming imgurl contains a JSON array of filenames

    
    filesToDelete.forEach(file => {
      const filePath = path.join(__dirname, '..', 'client', 'public', 'book', file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Failed to delete file`, err);
        } else {
          console.log(`Deleted file`);
        }
      });
    });

    // Delete the book entry from the database
    const deleteQuery = 'DELETE FROM freebook WHERE idfreebook = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Book and associated files deleted successfully' });
    });
  });
});


app.get('/feedbackget', (req, res) => {
  const query = 'SELECT * FROM feedback';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

app.listen(3001,()=>{
    console.log("hey,running.");
})
