const fetch = require('node-fetch');

class SmartsheetClient {
  async fetchUserData(email) {
    const searchUrl = `https://api.smartsheet.com/2.0/search/sheets/${process.env.SMARTSHEET_JOINER_SHEET_ID}?query=${encodeURIComponent(email)}`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!searchResponse.ok) throw new Error('Failed to search for user data in Smartsheet.');
    const searchData = await searchResponse.json();
    if (searchData.results.length === 0) throw new Error('User data not found in Smartsheet.');

    const rowId = searchData.results[0].objectId;
    const rowUrl = `https://api.smartsheet.com/2.0/sheets/${process.env.SMARTSHEET_JOINER_SHEET_ID}/rows/${rowId}`;
    const rowResponse = await fetch(rowUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!rowResponse.ok) throw new Error('Failed to fetch user row data from Smartsheet.');
    const rowData = await rowResponse.json();

    const onboardingPlanSheetId = rowData.cells.find(cell => cell.columnId === process.env.COLUMN_ID_ONBOARDINGPLANSHEETID)?.value;
    if (!onboardingPlanSheetId) throw new Error('Onboarding plan sheet ID not found in user data.');

    return { userData: rowData, onboardingPlanSheetId };
  }

  async fetchOnboardingPlan(onboardingPlanSheetId) {
    const sheetUrl = `https://api.smartsheet.com/2.0/sheets/${onboardingPlanSheetId}`;
    const sheetResponse = await fetch(sheetUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!sheetResponse.ok) throw new Error('Failed to fetch onboarding plan sheet from Smartsheet.');
    const sheetData = await sheetResponse.json();

    return sheetData.rows.map(row => ({
      Item: row.cells.find(cell => cell.columnId === process.env.COLUMN_ID_ITEM)?.value,
      Description: row.cells.find(cell => cell.columnId === process.env.COLUMN_ID_DESCRIPTION)?.value,
      Link: row.cells.find(cell => cell.columnId === process.env.COLUMN_ID_LINK)?.value,
    }));
  }

  async markOnboardingComplete(email) {
    const searchUrl = `https://api.smartsheet.com/2.0/search/sheets/${process.env.SMARTSHEET_JOINER_SHEET_ID}?query=${encodeURIComponent(email)}`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!searchResponse.ok) throw new Error('Failed to search for user data in Smartsheet.');
    const searchData = await searchResponse.json();
    if (searchData.results.length === 0) throw new Error('User data not found in Smartsheet.');

    const rowId = searchData.results[0].objectId;
    const updatePayload = {
      id: rowId,
      cells: [{
        columnId: process.env.COLUMN_ID_INDUCTIONCOMPLETE,
        value: true,
      }],
    };

    const updateResponse = await fetch(`https://api.smartsheet.com/2.0/sheets/${process.env.SMARTSHEET_JOINER_SHEET_ID}/rows`, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([updatePayload]),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to mark onboarding as complete: ${errorData.message}`);
    }

    return await updateResponse.json();
  }
}

module.exports = new SmartsheetClient();