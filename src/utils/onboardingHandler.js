function createOnboardingMessage(onboardingPlan, userData) {
    const blocks = [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Welcome ${userData.fullName}! We're excited to have you onboard.`,
            },
        },
        ...onboardingPlan.map((item, index) => ({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `${index + 1}. *${item.Item}:* ${item.Description}`,
            },
            accessory: item.Link ? {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'More info',
                },
                url: item.Link,
                action_id: `action_more_info_${index}`,
            } : null,
        })),
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Complete Onboarding',
                    },
                    value: 'complete_onboarding',
                    action_id: 'complete_onboarding',
                },
            ],
        },
    ];

    // Filter out any null if no link is provided
    return blocks.filter(block => block !== null);
}

module.exports = { createOnboardingMessage };