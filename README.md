[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to/getlarge/integrating-ory-in-production-with-nestjs-3nic)
[![Ory](https://img.shields.io/badge/ory-%230A0A0A.svg?style=for-the-badge&logo=ory&logoColor=white)](https://ory.sh/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Jest](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)](https://nx.dev/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![fork with dotenv-vault](https://badge.dotenv.org/fork.svg?r=1)](https://vault.dotenv.org/project/vlt_a214f90f4b82d8ad4ca0c4b2a458f85f1eb137a0d7ebce91325a339fa48edad1/example)

<p align="center">
  <a href="https://github.com/getlarge/nestjs-ory-integration/" target="blank"><img src="https://ipfs.io/ipfs/QmQ6CMaraTMrv8byJfY64mDM6o7citx1pgEobMKWEJaSCB?filename=ory-nestjs-min.png" width="120" alt="NestOry Logo" /></a>
</p>

# CatFostering

This demonstration app is a web-based platform (REST API) called `CatFoster`. The CatFoster application is a simplified example that demonstrates the integration of Ory in a NestJS application. The application will not cover frontend development and deployment, focusing solely on the backend implementation.

> **Note**
> If this is your first time working with Ory, I recommend reading the [Introduction to Ory](https://dev.to/getlarge/introduction-to-ory-47nh) article to familiarize yourself with the core components and concepts of Ory.

## Key Features

1. **User Authentication and Profile Management:**

   - **Ory Integration:** Utilize Ory's authentication system to handle user registrations, logins, password resets, and profile management.
   - **User Roles:** There is one static user role, `Admin`, that a super admin can assign to users after registration.

2. **Cat Profiles:**

   - **Listing and Management:** Cat owners can create profiles for their cats, including photos, descriptions, special care instructions, and availability for fostering. Admins can edit and delete cat profiles.
   - **Search and Filters:** Users looking to foster cats can search for them based on filters.

3. **Fostering Matchmaking:**

   - **Requests and Approvals:** Cat fosters can send fostering requests to cat owners, who can review and approve or deny them based on the foster's profiles.
   - **Authorization Checks:** Use Ory to manage authorization, ensuring that only cat owners can approve fostering requests and only registered users can send requests.

## Design phase

### Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#5d9fd8', 'textColor': 'black', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#a0c8e8' }}}%%
graph TD
    UI(Self-service UI) -->|Register/Login <br>Manage Account| OryKratos(Ory Kratos)
    NestJSApp(NestJS App) -->|Verify sessions| OryKratos
    NestJSApp -->|Create relationships <br> Check permissions| OryKeto(Ory Keto)
    NestJSApp -->|CRUD Operations \n Store User & Cat Profiles| Postgres[(Postgres)]
    OryKratos -->|Send webhooks| NestJSApp


    style UI fill:#a0c8e8,stroke:#333,stroke-width:2px
    style OryKratos fill:#ffdd57,stroke:#333,stroke-width:2px
    style OryKeto fill:#6accbc,stroke:#333,stroke-width:2px
    style NestJSApp fill:#ff6f61,stroke:#333,stroke-width:2px
    style Postgres fill:#5d9fd8,stroke:#333,stroke-width:2px
```

- **Self-service UI**: This is the frontend where users can log in and manage their accounts. It communicates directly with Ory Kratos for authentication-related tasks.
- **Ory Kratos**: Handles authentication. It's responsible for user login, account management, and session management. It interacts with the NestJS app via HTTP webhooks to replicate user data on signup.
- **HTTP Webhooks**: Serve as the communication link between Ory Kratos and the NestJS app, ensuring the user is replicated in the local database upon signup.
- **NestJS App**: The core of your application is handling business logic, CRUD operations with the Postgres database, authentication checks with Ory Kratos, and authorization with Ory Keto.
- **Ory Keto**: Manages authorization, determining what authenticated users are allowed to do within the application.
- **Postgres**: The database where user data (replicated from Ory on signup), cat profiles and fostering requests are stored. The NestJS app interacts with Postgres for all data storage and retrieval operations.

Check out the complete [Ory Integration guide](https://dev.to/getlarge/integrate-ory-in-a-nestjs-application-4llo) to learn how to integrate Ory Kratos and Ory Keto into your NestJS application.
