const darkModeToggle = document.querySelectorAll('#dark-mode');

// Check if dark mode setting exists in localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.documentElement.setAttribute('data-theme', 'dark'); // Apply dark mode styles
  darkModeToggle.forEach((btn) => btn.checked = true); // Check the checkbox
} else {
  document.documentElement.setAttribute('data-theme', 'light'); // Apply light mode styles
  darkModeToggle.forEach((btn ) => btn.checked = false) ; // Uncheck the checkbox
}

// Event listener for toggling dark mode
darkModeToggle.forEach((btn ) => btn.addEventListener('change', () => {
  if (btn.checked) {
    // Enable dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('dark-mode', 'enabled'); // Save dark mode preference
  } else {
    // Disable dark mode
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('dark-mode', 'disabled'); // Save light mode preference
  }
}))