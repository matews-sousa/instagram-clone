# Instagram Clone

A Instagram clone made with Next.js, Firebase and Tailwind CSS. This project was made for learning Firebase Authentication, Firestore and Cloud Storage, along with Next.js, Typescript and Tailwind CSS.

### View the project live at https://instagram-clone-lovat-psi.vercel.app

## Demo users

You can Sign Up for your own account or Sign In with the following users to test the application

1. Loretta
    - Email: lore_kohn@email.com
    - Password: 123456
2. Jacob Small
    - Email: lore_kohn@email.com
    - Password: 123456
3. Fanny Luebke
    - Email: fannyluebke@email.com
    - Password: 123456
4. Sprinkle
    - Email: frank@email.com
    - Password: 123456

## Features

- Sign Up and Sign In
- View posts feed
- Publish posts
- Edit profile
- Follow and unfollow users
- Like and comment other user's post

## Tech Stack

- [Next.js](https://nextjs.org)
- [Typescript](https://www.typescriptlang.org)
- [Firebase](https://firebase.google.com/?hl=en)
- [Tailwind CSS](https://tailwindcss.com)

## Run the project locally

```bash
$ git clone https://github.com/matews-sousa/instagram-clone.git
$ cd instagram-clone
$ yarn
```

### Firebase Configuration

Get an overview of Firebase, how to create a project, what kind of features Firebase offers, and how to navigate through the Firebase project dashboard in this [visual tutorial for Firebase](https://www.robinwieruch.de/firebase-tutorial/).

- copy/paste your configuration from your Firebase project's dashboard into one of these files
  - utils/firebase.ts
  - .env.local

The .env.local file could look like the following then:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCQrW1QPUNp1JSrWaEv9z1Bj0nGH7M8ey4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=instagram-clone-demo-87dbf.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=instagram-clone-demo-87dbf
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=instagram-clone-demo-87dbf.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=188905001064
NEXT_PUBLIC_FIREBASE_APP_ID=1:188905001064:web:033035c6e97118f8556bdd
```

1. Run ```yarn dev```
2. Open http://localhost:3000

- For the authentication to work you need to enable Email/Password on Authentication section.
- For saving data you need to create database on Firestore Database section.
- For storing files you need to Set up Cloud Storage on Storage section.