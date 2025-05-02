export function formatDistanceToNow(date: Date | string): string {
  const now = new Date();
  
  // Convert string to Date if needed
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if dateObj is a valid Date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.error("Invalid date:", date);
    return "unknown time ago";
  }
  
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

export function formatDate(date: Date | string): string {
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if dateObj is a valid Date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "Unknown date";
    }
    
    // Use a more compatible date formatting approach
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error, "for date:", date);
    // Even more basic fallback
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    } catch (e) {
      return "Invalid date";
    }
  }
}

export function formatTime(date: Date | string): string {
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if dateObj is a valid Date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error("Invalid date for time formatting:", date);
      return "Unknown time";
    }
    
    // Format time in a more compatible way
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error, "for date:", date);
    return "Unknown time";
  }
}

export function formatDateTime(date: Date | string): string {
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if dateObj is a valid Date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error("Invalid date for datetime formatting:", date);
      return "Unknown date/time";
    }
    
    return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
  } catch (error) {
    console.error("Error formatting datetime:", error, "for date:", date);
    return "Invalid date/time";
  }
}