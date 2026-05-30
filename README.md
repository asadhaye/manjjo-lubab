# Manjjo - Restaurant Ordering App

This project represents a production-grade restaurant ordering application, currently deployed at `manjjo.pk`. It is engineered to showcase robust web development practices, featuring a dynamic menu, an intuitive shopping cart, and streamlined order processing via WhatsApp, all integrated with Google Sheets for efficient management.

## Key Features (Agency-Level Implementation)

*   **Dynamic Menu Management:** Fetches and displays menu items from a configurable Google Sheet, allowing for flexible and real-time menu updates without code changes.
*   **Advanced Shopping Cart:** Provides a seamless user experience for adding, removing, and updating item quantities, with persistent cart state.
*   **Integrated WhatsApp Ordering:** Generates pre-filled, structured WhatsApp messages for order placement, enhancing customer convenience and operational efficiency.
*   **Robust Google Sheets Integration:** Securely stores new orders and retrieves menu data, demonstrating a reliable backend integration for data management.
*   **Configurable Branch Management:** Supports multiple restaurant branches with externalized configuration, enabling easy scaling and location-specific operations.
*   **Responsive and Adaptive Design:** Optimized for a consistent and engaging user experience across a wide range of devices and screen sizes.
*   **Intelligent Geofencing and Address Validation:** Implements sophisticated, location-specific validation for delivery addresses (currently tailored for Lahore, Pakistan), ensuring accurate delivery logistics. This includes:
    *   **Pakistani Phone Number Formatting:** Enforces strict validation for Pakistani phone numbers (e.g., `03XXXXXXXXX`), ensuring correct contact information.
    *   **Lahore-Specific Address Validation:** Utilizes a comprehensive list of Lahore tehsils and areas to validate delivery addresses, minimizing delivery errors and optimizing routes.

## Technologies and Architecture

This application is built with a modern, scalable stack:

*   **Next.js:** A powerful React framework for production-ready applications, enabling server-side rendering and static site generation.
*   **TypeScript:** Ensures type safety and enhances code quality and maintainability across the codebase.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent UI development.
*   **Google Sheets API:** Utilized for flexible and accessible data storage and retrieval for menu items and order records.
*   **WhatsApp API (via Deep Links):** Facilitates direct customer communication and order submission through the WhatsApp platform.

## Getting Started

To set up and run this production-ready project locally, follow these detailed instructions.

### Prerequisites

Ensure your development environment meets the following requirements:

*   **Node.js:** Version 18 or higher.
*   **pnpm:** A fast, disk space efficient package manager (alternatively, npm or yarn can be used).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/manjjo-lubab.git
    cd manjjo-lubab
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

### Configuration

This project is designed for robust deployment, relying on environment variables and external configuration files for sensitive data and dynamic content. Proper setup is crucial for functionality.

1.  **Google Sheets Setup:**
    *   **Create Google Sheets:** You will need two distinct Google Sheets: one for your **Menu data** and another for **Order records**.
    *   **Obtain Spreadsheet ID:** Locate the **Spreadsheet ID** from the URL of your Menu sheet (e.g., `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`). This ID will be used for both sheets.
    *   **Service Account Key:** Create a Google Cloud Platform project, enable the Google Sheets API, and generate a **Service Account Key** in JSON format. This key is essential for secure API authentication.

2.  **Environment Variables:**
    Create a `.env.local` file in the root of your project by copying the example:

    ```bash
    cp .env.local.example .env.local
    ```

    Edit `.env.local` and populate it with your specific credentials and configurations:

    ```
    NEXT_PUBLIC_GOOGLE_SHEETS_ID=YOUR_SPREADSHEET_ID_HERE
    GOOGLE_SERVICE_ACCOUNT_KEY=\n"YOUR_ENTIRE_SERVICE_ACCOUNT_KEY_JSON_HERE"\n
    NEXT_PUBLIC_WHATSAPP_NUMBER=YOUR_WHATSAPP_NUMBER_HERE
    ```

    *   `NEXT_PUBLIC_GOOGLE_SHEETS_ID`: The unique identifier for your Google Spreadsheet, used for both menu data retrieval and order saving.
    *   `GOOGLE_SERVICE_ACCOUNT_KEY`: The complete JSON content of your Google Service Account Key. **Ensure proper escaping for newlines, or paste as a single, continuous line.**
    *   `NEXT_PUBLIC_WHATSAPP_NUMBER`: The designated WhatsApp number (including country code, without `+` or `00`) for receiving orders (e.g., `923098009999`).

3.  **Branch Configuration:**
    Create a `config/branches.json` file based on the provided example:

    ```bash
    mkdir -p config
    cp config/branches.example.json config/branches.json
    ```

    Edit `config/branches.json` to accurately define your restaurant branches. Each entry should include an `id`, `name`, `address`, `area`, and an optional `photo` path.

### Running the Development Server

To start the application in development mode:

```bash
pnpm dev
```

Access the application via your web browser at [http://localhost:3000](http://localhost:3000).

## Deployment

This project is designed for seamless deployment to modern platforms such as [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Ensure all environment variables are securely configured within your chosen deployment environment.

## Contributing

We welcome contributions to enhance this project. Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
