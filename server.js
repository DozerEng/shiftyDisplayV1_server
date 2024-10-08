let express = require('express');
let app = express();
let port = 3000;

app.use(express.static('public'));
app.use("/images", express.static('images')); //url now requires /images/filename rather than just /filename

//Hanlding errors that make it past routes
app.use((req, res, next) => {   
  const error = new Error("Not found"); //message for error
  error.status = 404; //404 handler
  next(error);
});

//Handling of all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500); //sending the error code
  res.json({
      error: {
          message: error.message //sending the error message
      }
  });
});


app.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);

});