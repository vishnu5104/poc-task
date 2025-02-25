# Draw

This project allows users to create and join rooms for real-time collaboration using WebSockets (Socket.io). Users in the same room can collaborate and chat in real time.

## Getting Started

### Installation

You can use Bun, npm, or Yarn to install dependencies.

#### Using Bun

```bash
bun install
```

#### Using npm

```bash
npm install
```

#### Using Yarn

```bash
yarn install
```

### Running the Project

Start the development server with:

#### Using Bun

```bash
bun run dev
```

#### Using npm

```bash
npm run dev
```

#### Using Yarn

```bash
yarn dev
```

### Accessing the Application

Once the server is running, open your browser and go to:

```
http://localhost:3000
```

## How It Works

### Create a Room

Users can create a new room from the homepage.

### Join a Room

Other users can join the room by entering the room ID.

### Real-Time Collaboration

Users in the same room can collaborate in real time using WebSockets (Socket.io).
They can also chat with each other while collaborating.

## Features

- Room creation and joining via unique ID
- Real-time updates and synchronization
- Chat functionality within the room

## Technologies Used

- Next.js
- Socket.io for real-time communication and chat
- Bun/npm/Yarn for package management
