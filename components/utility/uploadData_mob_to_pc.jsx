// utils/uploadAudio.js
export async function uploadAudio(uri) {
  try {
    const fileName = uri.split('/').pop() || 'recording.m4a';
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: 'audio/m4a',
    });

    const uploadUrl = 'http://192.168.18.8:5000/upload';

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

    const responseJson = await response.json();
    console.log('Upload success:', responseJson);
  } catch (error) {
    console.error('Upload error:', error);
  }
}
