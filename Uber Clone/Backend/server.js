// const dotenv = require('dotenv');
// dotenv.config();
const app = require('./app');


const PORT = process.env.PORT || 4000;  // fallback to 2000 only if env not set

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
