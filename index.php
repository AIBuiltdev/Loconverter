<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SX4x4R Address Helper</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script type="module" src="./mt-osgridref.js"></script>
    <script type="module" src="./main.js"></script>

    <style>
        #map {
            height: 60vh;
            width: 85%;
            margin: 0 auto;
        }
        #results {
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <form id="addressForm">
        <label for="address">Address:</label>
        <input type="text" id="address" name="address" required>
        <button type="submit">Search</button>
    </form>
    <div id="map"></div>
    <div id="results"></div>
</body>
</html>
