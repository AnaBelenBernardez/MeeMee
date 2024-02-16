import axios from "axios";

export const createMeetup = async (meetupData, token) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/meetups`,
      meetupData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      return data;
    } else {
      const data = response.data;
      console.error("Error in createMeetup:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error in createMeetup:", error.message);
    throw new Error(`Error en la creación del meetup: ${error.message}`);
  }
};

export const getAttendeesByMeetup = async (meetupId, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/attendees/${meetupId}/list`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } else {
      console.error("Error in getAttendeesByMeetup:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // console.warn("Meetup has no attendees");
      return [];
    } else {
      console.error("Error in getAttendeesByMeetup:", error.message);
      throw new Error(
        `Error al obtener la lista de asistentes: ${error.message}`
      );
    }
  }
};
export const registerUserService = async (userData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/user/register`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`The ${error.message}`);
  }
};

export const loginUserService = async ({ email, password }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    return json.token;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const activateUserService = async ({ token }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/activate-account/${token}`
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    return json.message;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserService = async ({ data, token, id }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/user/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    return json.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDataUserService = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/user/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updataUserEmailService = async ({ email, token, id }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/user/email/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Frontend-URL": import.meta.env.VITE_APP_FRONTEND,
          Authorization: token,
        },
        body: JSON.stringify({ email }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchMeetups = async () => {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND}/meetups`);
  const data = await response.json();
  return data || [];
};
export const updataUserPasswordService = async ({ password, token, id }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/user/password/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ password }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createAttendeeService = async ({ meetupId, userId, token }) => {
  try {
    const createResponse = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/attendees/create`,
      { meetupId, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (createResponse.status >= 200 && createResponse.status < 300) {
      const data = createResponse.data;
      return data;
    } else if (createResponse.status === 404) {
      return { message: "Attendee created successfully." };
    } else {
      const data = createResponse.data;
      console.error("Error in createAttendeeService:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error in createAttendeeService:", error.message);
    throw new Error(`Error en la creación del asistente: ${error.message}`);
  }
};

export const deleteAttendeeService = async ({ meetupId, userId, token }) => {
  try {
    const checkResponse = await axios.get(
      `${
        import.meta.env.VITE_APP_BACKEND
      }/attendees/${meetupId}/user/${userId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (checkResponse.status !== 200) {
      return { message: "Attendee does not exist." };
    }

    const deleteResponse = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/attendees/delete`,
      { meetupId, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
      const data = deleteResponse.data;
      return data;
    } else {
      const data = deleteResponse.data;
      console.error("Error in deleteAttendeeService:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error in deleteAttendeeService:", error.message);
    throw new Error(`Error al eliminar el asistente: ${error.message}`);
  }
};

export const deleteMeetup = async (meetupId, token) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_BACKEND}/meetups/${meetupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      return data;
    } else {
      const data = response.data;
      console.error("Error in deleteMeetup:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error in deleteMeetup:", error.message);
    throw new Error(`Error al eliminar el meetup: ${error.message}`);
  }
};
