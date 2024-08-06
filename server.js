const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const GITHUB_TOKEN = 'your_github_token';
const REPO_OWNER = 'your_username';
const REPO_NAME = 'your_repo';
const FILE_PATH = 'attendees.md';
const BRANCH = 'main';

app.post('/update-md', async (req, res) => {
    const { content } = req.body;

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
            content: Buffer.from(fileContent + `\n${content}`).toString('base64'),
            sha,
            branch: BRANCH
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.send('File updated successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating file');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
