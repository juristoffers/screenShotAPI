const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/tradereview/:identifier', async (req, res) => {
  const identifier = req.params.identifier;
  const pageUrl = `https://www.tradingview.com/x/${identifier}/`;

  try {
    // Step 1: Fetch the page HTML
    const response = await axios.get(pageUrl);
    const html = response.data;

    // Step 2: Parse HTML to extract the image URL
    const $ = cheerio.load(html);
    const imageUrl = $('img.tv-snapshot-image').attr('src');

    if (!imageUrl) {
      throw new Error('Image URL not found in the page.');
    }

    // Step 3: Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data, 'binary');

    // Step 4: Save the image to the local directory
    const imagePath = path.join(__dirname, `${identifier}.png`);
    fs.writeFileSync(imagePath, buffer);

    // carry out GPT API call

    // Send success message
    res.json({ message: 'Image downloaded successfully', imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the image.');
  }
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
