const router = require('express').Router();
const fs = require('fs');

router.get('*', (req, res) => {
  const index = fs.readFileSync('./views/index.html').toString();
  const frame = index;
  res.send(frame);
});

module.exports = router;
