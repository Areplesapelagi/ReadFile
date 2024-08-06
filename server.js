const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GitHub configuration
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
const REPO_OWNER = 'YOUR_GITHUB_USERNAME';
const REPO_NAME = 'YOUR_REPO_NAME';
const FILE_PATH = 'attendees.md'; // Path to the file in the repo
const BRANCH = 'main'; // Branch to update

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission and update the Markdown file
app.post('/update-md', async (req, res) => {
    const { attendee_name, pax_number, phone_number, attendee_comment, status } = req.body;
    
    // Prepare content to add
    const content = `### Attendee: ${attendee_name}\n- **Pax**: ${pax_number}\n- **Phone**: ${phone_number}\n- **Comment**: ${attendee_comment}\n- **Status**: ${status}\n`;

    try {
        // Fetch the current file content
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const fileContent = Buffer.from(response.data.content, 'base64').toString();
        const sha = response.data.sha;

        // Update the file
        await axios.put(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update attendees.md',
            content: Buffer.from(fileContent + content).toString('base64'),
            sha,
            branch: BRANCH
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.send('Attendee updated successfully!');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error updating file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
