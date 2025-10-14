import { deleteCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const ErrorHandlerAPI = (error: any) => {
  // Log the error for debugging purposes
  console.error("API Error:", error);
  
  // Handle network errors
  if (!error.response) {
    toast.error("Network error. Please check your connection.");
    return { 
      data: { 
        message: "Network error. Please check your connection.",
        success: false
      }
    };
  }
  
  // Handle authentication errors
  const authErrors = [
    "Invalid or expired JWT",
    "jwt malformed",
    "invalid token",
    "invalid signature",
    "Authentication invalid",
    "invalid algorithm"
  ];
  
  if (authErrors.includes(error?.response?.data?.message)) {
    deleteCookie("token");
    toast.error("Session expired. Please log in again.");
    window.location.href = "/login";
    return error.response;
  }
  
  // Handle specific status codes
  switch (error.response.status) {
    case 400:
      toast.error("Bad request. Please check your input.");
      break;
    case 401:
      toast.error("Unauthorized. Please log in.");
      break;
    case 403:
      toast.error("Forbidden. You don't have permission to access this resource.");
      break;
    case 404:
      toast.error("Resource not found.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    case 502:
      toast.error("Bad gateway. Please try again later.");
      break;
    case 503:
      toast.error("Service unavailable. Please try again later.");
      break;
    default:
      toast.error(error?.response?.data?.message || "An unexpected error occurred.");
  }
  
  return error.response;
};
