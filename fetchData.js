async function addDataToQuickBase(dbid, data) {
  const url = `https://api.quickbase.com/v1/records`;

  const payload = {
      to: dbid,
      data: [
          {
              6: {
                  "value": data.stringField
              },
              7: {
                  "value": JSON.stringify(data.arrayField) // Store array as JSON string
              }
          }
      ]
  };

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'QB-Realm-Hostname': 'owennoah.quickbase.com',
          'Authorization': `QB-USER-TOKEN b9mj6a_q8fu_0_btahs3vdaa8xvjdu2ms5gdkqw7t5`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('Data added:', result);
}

// Example data
const dbid = 'bub62cryf';
const data = {
  stringField: 'Example String',
  arrayField: ['Item 1', 'Item 2', 'Item 3']
};

addDataToQuickBase(dbid, data);