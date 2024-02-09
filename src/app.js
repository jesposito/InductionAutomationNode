require('dotenv').config();
const express = require('express');
const { fetchUserEmailFromSlack, postMessageToSlack } = require('./slack/slackClient');
const { fetchUserDataFromSmartsheet, fetchOnboardingPlan, markOnboardingComplete } = require('./smartsheet/smartsheetClient');
const { createOnboardingMessage } = require('./utils/onboardingHandler'); 

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/slack/events', async (req, res) => {
    const request = req.body;
    if (request.type === 'url_verification') {
        res.json({ challenge: request.challenge });
    } else if (request.event && request.event.type === 'member_joined_channel' && request.event.channel === process.env.ONBOARDING_CHANNEL_ID) {
        const userId = request.event.user;
        try {
            const userEmail = await fetchUserEmailFromSlack(userId);
            const { userData, onboardingPlanSheetId } = await fetchUserDataFromSmartsheet(userEmail);
            const onboardingPlan = await fetchOnboardingPlan(onboardingPlanSheetId);
            const onboardingMessage = createOnboardingMessage(onboardingPlan, userData);
            await postMessageToSlack(userId, onboardingMessage);
            // Additional functionalities like notifyManager or sendEmail can be implemented here
        } catch (error) {
            console.error("Error handling member_joined_channel event:", error);
            res.status(500).json({ message: "Error initiating onboarding" });
            return;
        }
        res.status(200).json({ message: "Onboarding initiated" });
    }
});

app.post('/slack/actions', async (req, res) => {
    let payload;
    if (req.body.payload) {
        // Parse the payload if it's a string
        payload = JSON.parse(req.body.payload);
    } else {
        // Use the payload directly if it's already an object
        payload = req.body;
    }

    if (payload.type === 'block_actions' && payload.actions[0].action_id === 'complete_onboarding') {
        const userId = payload.user.id;
        try {
            await markOnboardingComplete(userId);
            res.status(200).json({ message: "Onboarding marked as complete" });
        } catch (error) {
            console.error("Error marking onboarding as complete:", error);
            res.status(500).json({ message: "Failed to mark onboarding as complete" });
            return; // Ensure no further code is executed after sending the response
        }
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));