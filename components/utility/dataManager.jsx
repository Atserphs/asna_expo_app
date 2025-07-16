// components/utility/DataManager.jsx
export async function handleUserInput(inputType, inputData) {
  try {
    const apiUrl = 'http://192.168.18.8:5000/process';

    let response;
    if (inputType === 'audio') {
      // inputData = local URI to audio file

      const formData = new FormData();
      const fileName = inputData.split('/').pop();

      formData.append('file', {
        uri: inputData,
        name: fileName,
        type: 'audio/m4a',
      });

      response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } else if (inputType === 'text') {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_type: 'text', input_data: inputData }),
      });
    }

    if (!response.ok) throw new Error('Failed to get response');

    const data = await response.json();

    // This data get return to input interface to check so don't mess with it
    return {
      userQuery: data.user_query,
      actionType: data.action_type,
      actionData: data.action_data,
    };
  } catch (err) {
    console.error('DataManager error:', err);
    throw err;
  }
}
