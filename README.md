# WHZAN Catalog Explorer App

Front-end for the backend in repo below:

```bash
https://github.com/Yenzokuhle/whzan-api
```

React typescript on Vite.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before we get started, we're going to need to make sure we have a few things installed and available on our machine.

#### Node 20.11.0

#### NPM is the package manage useds

#### React 19.0.0

##### Other

See the installation guides available @ nodejs.org:

https://nodejs.org/en/download/package-manager/

#### NPM

```bash
npm install -g npm
```

### Installing

Below is a series of step by step instructions that tell you how to get a development env running.

Create a local clone of the repository.

```bash
git clone git@github.com:Yenzokuhle/whzan-catalog-app.git
```

Enter the cloned repositories' directory.

```bash
cd /whzan-catalog-app
```

Install all the projects dependencies

```bash
npm install
```

Create an `.env` file based on the below variables

Export the contents of the created `.env`s by saving new values in file.

```bash
VITE_PUBLIC_API_HOST=
```

You will substitute the above env variable for your locally running C# .NET Restfull API provide

Now you can run your app

```bash
npm run dev
```

Generate the build files for deployment

```bash
npm run build
```

Make sure the backend server is running to have the full app experience.

## Built With

The details of the tech stack that has been used:

- [React](https://reactjs.org/) - Client Framework
- [Vite](https://vite.dev/guide/) - Frontend build tool
- [TailwindCSS](https://tailwindcss.com/) - Style Framework
- [React Hook Form](https://www.react-hook-form.com/) - Input form handling

## Architecture

- [react-router-dom](https://styled-components.com/) - App navigation.
