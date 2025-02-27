# yAccessibility - Website Accessibility Widget

[![GitHub license](https://img.shields.io/github/license/yortem/yAccessibility)](https://github.com/yortem/yAccessibility/blob/main/LICENSE)

**yAccessibility** is a lightweight and easy-to-integrate accessibility widget for websites. It allows users to customize their browsing experience according to their needs, helping to make the site accessible for people with disabilities.

![A screenshot of the widget](yaccessibility-screenshot.jpg)

## Key Features

*   **Color Contrast:** Change color contrast for improved readability.
*   **Grayscale:** Convert the website to grayscale for users with specific visual needs.
*   **Highlight Links:** Highlight links to make navigation easier.
*   **Readable Font:** Switch to a more readable font.
*   **Image Description:** Display image descriptions (alt text).
*   **Increase/Decrease Font Size:** Control text size.
*   **Stop Animations:** Stop flickering animations that may be distracting.
*   **Big Cursor:** Change the cursor to a larger size for better visibility.
*   **Multi-Language Support:** The widget supports multiple languages, and you can contribute new translations!
*   **Easy Integration:** The widget can be easily integrated into any website.
*   **Open Source:** The widget's code is available to everyone, allowing for modifications and contributions.
*   **Reset:** Button that allows to reset all changes.
*   **Statement page:** Button that opens the statement page on your site.

## Installation and Usage

1.  **Download Files:** Download the `yaccessibility.js`, `yaccessibility.css` files, and `languages` folder from the repository.
2.  **Add to Website:** Add the files to your website.
3.  **Add JavaScript Link:** Before closing the `</body>` tag of your HTML file, add the following lines:

    ```html
    <script src="yaccessibility.js"></script>
    <script>
        yAccessibility({
            language: 'he', // Set the language to Hebrew
            statement: 'accessibility-statement.html' // Optional: The URL to the accessibility statement file
        });
    </script>
    ```

    *   **Explanation:**
        *   The `yAccessibility` function takes an **options object** as a parameter.
        *   **`language`:** (Optional, default: `'en'`) Specifies the desired language code (e.g., `'en'`, `'he'`). If there is no translation for the specified language, the English language will be displayed as the default.
        *   **`statement`:** (Optional, default: `null`) Specifies the URL to your accessibility statement page. If provided, a button linking to this page will be added to the widget.

    **Example of using default values:**
    ```html
        yAccessibility(); // use default english langauge without statement page
    ```
    **Example of using English language with statement page:**
    ```html
        yAccessibility({
            language: 'en', 
            statement: 'accessibility-statement.html'
        });
    ```

## Multi-Language Support

The widget supports multiple languages using JSON files. Each language is in a separate file within the `languages` directory. feel free to add your language if it doesn't exists in the repositery. 

### Language File Structure

Each JSON file contains key-value pairs. The key is a unique identifier, and the value is the translated text in the relevant language.

**Example (`en.json`):**

```json
{
    "accessibility_title": "Accessibility",
    "open_accessibility_bar": "Open Accessibility Bar",
    "close_accessibility_bar": "Close Accessibility Bar",
    "contrast": "Color Contrast",
    "highlight_links": "Highlight Links",
    "simple_font": "Readable Font",
    "alt_text": "Image Description",
    "increase_font": "Increase Font Size",
    "decrease_font": "Decrease Font Size",
    "stop_flickering": "Stop Animations",
    "accessibility_statement": "Accessibility Statement",
    "reset": "Reset",
    "credits": "Accessibility widget by "
  }
  ```