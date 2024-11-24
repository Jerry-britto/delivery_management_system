import axios from "axios";

export const getDeliveryPartner = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/partners");
  
      // Check if the response is successful
      if (res.status === 200) {
        return res.data.partners;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (error: any) {
      // Handle known Axios errors
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
  
        // Optional: Check for specific HTTP error statuses
        if (error.response) {
          console.error(`HTTP Error ${error.response.status}:`, error.response.data?.message);
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        }
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
  
      throw new Error("Failed to fetch delivery partners. Please try again later.");
    }
  };

  export const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/orders");
  
      // Check if the response is successful
      if (res.status === 200) {
        return res.data.orders;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (error: any) {
      // Handle known Axios errors
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
  
        // Optional: Check for specific HTTP error statuses
        if (error.response) {
          console.error(`HTTP Error ${error.response.status}:`, error.response.data?.message);
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        }
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
  
      throw new Error("Failed to fetch delivery partners. Please try again later.");
    }
  };