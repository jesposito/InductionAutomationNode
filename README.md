# Induction Automation App (Node)

### Purpose

The purpose of this project is to automate and streamline the onboarding process for new hires at Ryman. By integrating Slack with Smartsheet, we can provide a personalized onboarding experience for each new team member, ensuring they have all the information they need to get started in their new role.

The application listens for `member_joined_channel` events from Slack, then uses the new member's email to fetch their onboarding plan from Smartsheet. This plan is then sent to the new hire as a personalized message on Slack, providing them with a clear and organized list of tasks to complete as part of their onboarding.

This system not only makes the onboarding process more efficient, but also helps new hires feel welcomed and empowered from their first day on the job. It's part of our commitment to creating a positive and supportive work environment for all team members.

## Key Features

* **Slack Event Trigger:** When a new user joins a designated Slack channel, the onboarding process is initiated.
* **Smartsheet Data Fetch:** The project retrieves the user's email address from Slack and uses it to fetch their corresponding onboarding data from a designated Smartsheet.
* **Personalized Onboarding Message:** A customized onboarding message is generated using the data from Smartsheet and sent to the new user directly on Slack.
* **Onboarding Completion:** The project offers functionality to mark the onboarding process as complete directly in Smartsheet.

## How it Works 

1. A new user joins a specific Slack channel (e.g., "#new-hires").
2. The project listens for this Slack event.
3. Upon the event, it fetches the user's email from Slack.
4. Using the email, it queries Smartsheet to find the user's onboarding plan.
5. A personalized onboarding message (with tasks, links, etc.) is compiled from the fetched data.
6. This message is sent to the user as a direct message on Slack.
7. (Optional) A button or action in Slack would allow the user to signal completion.
8. (Optional) Marking completion updates the associated row in Smartsheet.

### Prerequisites

- [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine. This project is built with Node.js, so you need to have it installed on your machine.
- [npm](https://www.npmjs.com/): A package manager for JavaScript, used to install dependencies.

### Configuration

The project uses environment variables for configuration. These are loaded from a `.env` file in your project root at runtime by Node.js. Here's what each variable is used for:

- `SLACK_TOKEN`: Your Slack API token. This is used to authenticate requests to the Slack API.
- `SMARTSHEET_TOKEN`: Your Smartsheet API token. This is used to authenticate requests to the Smartsheet API.
- `SMARTSHEET_JOINER_SHEET_ID`: The ID of the Smartsheet that contains data about new hires.
- `COLUMN_ID_ONBOARDINGPLANSHEETID`: The ID of the column in the Smartsheet that contains the onboarding plan for each new hire.
- `COLUMN_ID_ITEM`: The ID of the column in the Smartsheet that contains the items for each step of the onboarding plan.
- `COLUMN_ID_DESCRIPTION`: The ID of the column in the Smartsheet that contains the description for each step of the onboarding plan.
- `COLUMN_ID_LINK`: The ID of the column in the Smartsheet that contains the link for each step of the onboarding plan.
- `COLUMN_ID_FULLNAME`: The ID of the column in the Smartsheet that contains the full name of the new hire.
- `COLUMN_ID_INDUCTIONCOMPLETE`: The ID of the column in the Smartsheet that indicates whether the induction is complete.

Create a `.env` file in the root of the project and insert your keys/values as in the example below:
```
SLACK_TOKEN=your_slack_token
SMARTSHEET_TOKEN=your_smartsheet_token
ONBOARDING_CHANNEL_ID=your_onboarding_channel_id
SMARTSHEET_JOINER_SHEET_ID=your_smartsheet_joiner_sheet_id
COLUMN_ID_ONBOARDINGPLANSHEETID=your_column_id_onboardingplansheetid
COLUMN_ID_ITEM=your_column_id_item
COLUMN_ID_DESCRIPTION=your_column_id_description
COLUMN_ID_LINK=your_column_id_link
COLUMN_ID_FULLNAME=your_column_id_full_name
COLUMN_ID_INDUCTIONCOMPLETE=your_column_id_induction_complete
```

### Modules

This project consists of several modules, each with a specific role:

- `app.js`: This is the main application file. It sets up the server and routes, and imports the necessary configurations and functions from other modules.

- `slackClient.js`: This module contains the Slack client class for interacting with the Slack API.

- `smartsheetClient.js`: This module contains the Smartsheet client class for interacting with the Smartsheet API.

- `onboardingHandler.js`: This module contains utility functions that are used throughout the application. It includes a function to format the onboarding plan into a message that can be sent to Slack.

Remember to install the necessary dependencies by running `npm install` and set up your `.env` file with the appropriate API tokens and IDs before running the application.

### Running the Application

To start the server, run the following command in the terminal:
```
npm start
```

The server will start on the port specified in your `.env` file or default
