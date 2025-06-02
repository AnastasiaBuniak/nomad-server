const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Visit } = require('./models/');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// Example of creating a new user
const testVisit = new Visit({
  startDate: new Date('2023-10-01'),
  endDate: new Date('2023-10-10'),
  duration: 10,
  status: 'active'
});

testVisit
  .save()
  .then(doc => {
    console.log('Visit created successfully!', doc);
  })
  .catch(err => {
    console.error('Error creating visit:', err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
