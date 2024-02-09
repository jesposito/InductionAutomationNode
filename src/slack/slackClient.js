const fetch = require('node-fetch');

class SlackClient {
  async callSlackApi(endpoint, method = "GET", body = {}) {
    const url = `https://slack.com/api/${endpoint}`;
    const options = {
      method,
      headers: {
        "Authorization": `Bearer ${process.env.SLACK_TOKEN}`,
        "Content-Type": "application/json",
      },
    };
    if (method !== "GET") options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();
    if (!data.ok) throw new Error(`Slack API request failed: ${data.error}`);
    return data;
  }

  async fetchUserEmail(userId) {
    const data = await this.callSlackApi(`users.info?user=${userId}`);
    if (!data.user || !data.user.profile.email) throw new Error('Email not found for user.');
    return data.user.profile.email;
  }

  async postMessage(channel, text, blocks = []) {
    await this.callSlackApi("chat.postMessage", "POST", {
      channel,
      text,
      blocks,
    });
  }
}

module.exports = new SlackClient();