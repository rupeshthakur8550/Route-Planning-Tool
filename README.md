
# Route Planning Tool

Welcome to the Route Planning Tool project! This tool is designed to help technicians plan their routes efficiently by providing the shortest route from their location to all the addresses they need to visit.

## Features

- **Shortest Route Calculation**: The tool calculates the shortest route from the technician's location to all destinations using advanced route planning algorithms, including the nearest neighbor algorithm with the Haversine formula.
- **Node.js and Express.js Backend**: The backend of the application is built using Node.js and Express.js, providing robust server-side functionality.
- **SQLite Database**: The project utilizes SQLite database for data storage, ensuring data persistence and reliability.
- **React.js with Vite and Tailwind CSS Frontend**: The frontend is developed using React.js along with Vite for fast development and Tailwind CSS for easy and customizable styling.
- **Mapbox API Integration**: Mapbox API is integrated into the project to provide interactive maps and geocoding functionalities. You can use the attached Mapbox API key or provide your own in the client `.env` file to test the project.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/route-planning-tool.git
   ```

2. Navigate to the project directory:

   ```bash
   cd route-planning-tool
   ```
3. Make sure to add Mapbox API key in client/.env file as initially I have added my API key which we'll be removed from usage after a week.

4. Install dependencies for both client and server sides:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

5. Start the development at client and server side using below code:

   ```bash
   npm run dev
   ```
6. Open your web browser and navigate to `http://localhost:5173` to view the application.

## Usage

1. Enter the technician's location and addresses to visit.
2. Click on the "Plan Route" button.
3. The tool will calculate the shortest route and display it on the map.

Feel free to explore the project and provide any feedback or suggestions for improvement!

## License

This project is licensed under the [MIT License](LICENSE).
```
