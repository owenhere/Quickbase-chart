// Import necessary modules if any, though this is not explicitly defined in this example

async function fetchDataFromQuickbase(tableId, appId, id1, id2, id3) {
  const headers = {
    'QB-Realm-Hostname': 'icon.quickbase.com',
    'Authorization': 'QB-USER-TOKEN b9mjdd_py5p_0_c42bd7pbiju9q8c88smzkcgfs4in',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(`https://api.quickbase.com/v1/records/query`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "from": tableId,
        "select": [
          id1,
          id2,
          id3
        ],
        "options": {
          "skip": 0,
          "top": 0,
          "compareWithAppLocalTime": false
        }
      })
    });
    // console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Quickbase: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data.data is defined before mapping
    if (!data.data) {
      throw new Error('Data not found in API response');
    }
    console.log(data.data[0])
    const transformedData = data.data.map(record => {
      return [
        record[`${id1}`].value ? record[`${id1}`].value : 0, // Adjust based on your field name
        record[`${id2}`].value ? record[`${id2}`].value : 0,   // Adjust based on your field name
        record[`${id3}`].value ? record[`${id3}`].value : 0
      ]
    });
    return transformedData;

  } catch (error) {
    console.error('Error fetching data from Quickbase:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

function recorrect(data) {
  const sumMap = {};

// Iterate through each entry in the data array
  data.forEach(([yearWeek, resourceFTE, calendarFTE]) => {
    if (!sumMap[yearWeek]) {
      sumMap[yearWeek] = [0, 0]; // Initialize if not already present
    }
    sumMap[yearWeek][0] += resourceFTE;
    sumMap[yearWeek][1] += calendarFTE;
  });

  // Convert the map to an array and sort it by the first value
  const summedData = Object.entries(sumMap).map(([yearWeek, [resourceFTE, calendarFTE]]) => {
    return [parseFloat(yearWeek), resourceFTE, calendarFTE];
  });

  summedData.sort((a, b) => a[0] - b[0]);
  return summedData
};


function combineData(calendarData, resourceData) {
  const combinedData = [];

  calendarData.forEach((calendarEvent, index) => {
    const date = calendarEvent.Date.value; // Adjust based on your field name
    const calendarFTE = calendarEvent.FTE.value; // Adjust based on your field name
    const resourceFTE = resourceData[index]?.FTE.value || 0; // Adjust based on your field name
    combinedData.push([date, calendarFTE, resourceFTE]);
  });

  return combinedData;
}

// Define an async function to use await
async function fetchData() {
  // Uncomment if you need to fetch calendar data
  const calendarResourceEventsTableId = 'bua72hz6f';
  const Year_week_ID = 88;
  const ResourceFTE_ID = 69;
  const CalendarFTE_ID = 70;
  const appId = 'bua72hs5d';

  const calendar_resource_Data = await fetchDataFromQuickbase(calendarResourceEventsTableId, appId, Year_week_ID, ResourceFTE_ID, CalendarFTE_ID);
  const data = recorrect(calendar_resource_Data);
  console.log(data)
  // console.log( calendar_resource_Data)
}

// Call the async function to start fetching data
fetchData().catch(err => {
  console.error('Error fetching data:', err);
});
