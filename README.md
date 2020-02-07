# Allergeats

Allerg-eats is a mobile app where users with food allergies can scan barcodes of commercial food products to bring up crowdsourced reviews from other users with similar allergies.

The goal is to alleviate anxiety around introducing new foods into a user's diet, even with foods that do not contain the allergen.

## Installation

After forking/cloning the repo, to install dependencies run:

```bash
npm install
```

## Usage

```bash
npm start
```

This will open a browser window from Expo, that will allow you to open the app in either an Android or iOS simulator. To get the experience on your phone, download Expo Client from the App Store (available on both platforms) and scan the QR code.

For the best experience using this app, we recommend running this on iOS simulator, or your iPhone with Expo Client.

Scan the barcode of a commercial food product, which will bring up the information about the food product on your screen.

## Technologies

- [React Native](https://facebook.github.io/react-native/) with [Expo](https://expo.io/tools) - With React Native we were able to build an app that functions on both iOS and Android, and with Expo we were able to test and see our app function before deploying.
- [Firebase](https://firebase.google.com/) - Worked as our backend server, connecting our database to the front-end, as well as providing a simple OAuth solution for our login.
- [Cloud Firestore](https://firebase.google.com/docs/firestore) - A flexible NoSQL database that updates in real-time, allowing us to continuously add new features to our app without worrying about redesigning our database models.
