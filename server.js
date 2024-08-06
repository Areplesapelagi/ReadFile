const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 const GITHUB_TOKEN = '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';
const REPO_OWNER = 'Areplesapelagi';
const REPO_NAME = 'ReadFile';
const FILE_PATH = 'attendees.md'; // Path to the file in the repo
const BRANCH = 'main'; // Branch to update

app.post('/save', async (req, res) => {
    const { attendee_name, pax_number, phone_number, attendee_comment, status } = req.body;
    
    // Create the content to write
    const content = `### Attendee: ${attendee_name}\n- **Pax**: ${pax_number}\n- **Phone**: ${phone_number}\n- **Comment**: ${attendee_comment}\n- **Status**: ${status}\n\n`;
    
    // Fetch the current file content
    const fileContentResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!fileContentResponse.ok) {
        return res.status(fileContentResponse.status).send('Error fetching file content');
    }

    const fileContent = await fileContentResponse.json();
    const base64Content = Buffer.from(content + Buffer.from(fileContent.content, 'base64').toString()).toString('base64');

    // Update the file content
    const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update attendee information',
            content: base64Content,
            sha: fileContent.sha,
            branch: BRANCH
        })
    });

    if (updateResponse.ok) {
        res.send('Attendee information updated successfully');
    } else {
        res.status(updateResponse.status).send('Error updating file');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
