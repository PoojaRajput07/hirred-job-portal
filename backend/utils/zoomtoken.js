import axios from "axios";
export const getZoomAccessToken = async () => {
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    }
  );

  return response.data.access_token;
};
export const createZoomMeeting = async ({
  topic,
  startTime,
  duration,
}) => {
  const accessToken = await getZoomAccessToken();

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic,
      type: 2, // scheduled meeting
      start_time: startTime, // ISO string
      duration, // minutes
      timezone: "Asia/Kolkata",
      settings: {
        join_before_host: true,
        waiting_room: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    joinLink: response.data.join_url,
    meetingId: response.data.id,
  };
};
