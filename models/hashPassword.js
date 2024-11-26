import bcrypt from 'bcryptjs';

const password = 'gericopass123';  // Your plain-text password

// Hash the password
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Hashed Password:', hashedPassword);
  }
});
