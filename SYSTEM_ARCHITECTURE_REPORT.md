# System Architecture and Design Report: CCMC Bank Web Application

## Important Links

*   **GitHub Repository:** `[Link to GitHub Repo]`
*   **Deployed API:** `[Link to Deployed API]`
*   **Database Access/Details:** `[Link to Database]`
*   **Demo/Walkthrough Video:** `[Link to YouTube Video]`

---

## 1. System Architecture

This CCMC Bank Web Application employs a modern client-server architecture, specifically a **Single Page Application (SPA)** for the frontend, utilizing a **Backend as a Service (BaaS)** for its backend functionalities.

### 1.1. Main Components

The system is primarily composed of two main components:

1.  **Frontend (Client-Side):**
    *   **Framework:** React (using TypeScript)
    *   **Build Tool:** Vite
    *   **UI Libraries:** shadcn-ui and Tailwind CSS
    *   **Description:** The frontend is a dynamic Single Page Application responsible for rendering the user interface, managing user interactions, and communicating with the backend service. It's built with React for a component-based structure, TypeScript for type safety, and Vite for fast development and optimized builds. The UI is styled using Tailwind CSS and utilizes pre-built components from shadcn-ui for a consistent look and feel.

2.  **Backend (Server-Side via BaaS):**
    *   **Service:** Supabase
    *   **Description:** Supabase serves as the comprehensive Backend as a Service platform. It provides several key functionalities out-of-the-box:
        *   **Database:** A PostgreSQL database for data storage (customer profiles, accounts, transactions, loans, etc.).
        *   **Authentication:** Manages user registration, login, and session management (e.g., using JWTs).
        *   **APIs:** Automatically generated RESTful APIs for database operations, which the frontend consumes.
        *   **Realtime Capabilities:** (Potentially, if used) Supabase can provide real-time updates for features like live notifications or data synchronization.
        *   **Storage:** (Potentially, if used) For storing user-uploaded files or other static assets.
        *   **Serverless Functions:** While no custom functions are apparent in the `supabase/functions` directory of the provided codebase, Supabase allows for serverless functions (e.g., for custom business logic or integrations) which could be part of the broader deployment.

### 1.2. Component Interaction

*   **User Interaction:** Users interact with the React frontend through their web browsers.
*   **API Communication:** The React application communicates with Supabase via HTTPS. It sends requests to Supabase's auto-generated APIs for data operations (CRUD - Create, Read, Update, Delete) and authentication.
*   **Data Flow:**
    1.  The frontend makes API calls to Supabase (e.g., to fetch account details).
    2.  Supabase processes these requests, applying authentication checks and Row Level Security (RLS) policies to ensure data security.
    3.  Data is retrieved from or written to the PostgreSQL database.
    4.  Supabase returns the response (e.g., requested data or success/error messages) to the frontend.
    5.  The frontend updates the UI based on the received response.
*   **Authentication Flow:**
    1.  User submits credentials on the frontend.
    2.  Frontend sends credentials to Supabase Auth.
    3.  Supabase verifies credentials and, if successful, returns a JWT (JSON Web Token).
    4.  The frontend stores this JWT and includes it in subsequent API requests to authenticate the user.

---

## 2. Design

This section details the design considerations for the frontend and backend components of the CCMC Bank Web Application.

### 2.1. Frontend Design

*   **UI/UX Principles:**
    *   The application leverages **shadcn-ui** and **Tailwind CSS**. This choice promotes a consistent, modern, and utility-first approach to styling, allowing for rapid UI development and a responsive design that adapts to various screen sizes.
    *   The use of pre-built components from shadcn-ui ensures a cohesive user experience across the application.
*   **Component-Based Structure:**
    *   Built with **React**, the frontend follows a component-based architecture. This modular design enhances reusability, maintainability, and testability of UI elements. Key UI elements like navigation bars, tables, forms, and modals are encapsulated into distinct components (e.g., `AdminNav.tsx`, `AccountSummary.tsx`, `AddCustomerModal.tsx`).
*   **State Management:**
    *   The application utilizes **React Context** (e.g., `AuthContext.tsx`) for managing global state related to authentication and user information.
    *   For server state management (fetching, caching, updating data from the backend), **TanStack Query (React Query)** is used, as indicated by its setup in `App.tsx`. This library simplifies data fetching, reduces boilerplate, and provides features like caching, background updates, and optimistic updates.
*   **Routing:**
    *   Client-side routing is handled by **React Router DOM**, as seen in `App.tsx`. This enables navigation between different views/pages within the SPA without full page reloads, improving user experience. Protected routes (`ProtectedRoute.tsx`) and guest routes (`GuestRoute.tsx`) are implemented to manage access based on authentication status and roles (e.g., `requireAdmin`).

### 2.2. Backend Design (Supabase)

*   **Database Schema:**
    *   The backend uses a **PostgreSQL** database managed by Supabase. The schema is defined through SQL migrations (found in `supabase/migrations`). Key tables include:
        *   `profiles`: Stores user profile information (e.g., first name, last name, email). Likely linked to `auth.users` table in Supabase.
        *   `accounts`: Contains details of customer bank accounts (e.g., `customer_id` linking to `profiles`, account type, account number, balance).
        *   `transactions`: A ledger of all financial transactions, detailing amounts, types (deposit, withdrawal, payment), status, and linking to involved accounts and customers. It also includes a `transfer_id` to link with the `transfers` table.
        *   `transfers`: Records the intent and details of fund transfers, whether internal between user accounts or external. It tracks source/destination, amount, status, and the initiating user.
        *   `loans`: (Presence inferred from application features like `AdminLoanRequests.tsx` and `ApplyLoan.tsx`, though not detailed in the provided migration snippet). This table would store loan application details, amounts, types, statuses, and links to customers.
        *   `statements`: Stores information about generated account statements, including period, balances, and potentially a link to a downloadable file.
    *   **Relationships:** Foreign key constraints are used to maintain relational integrity (e.g., `accounts.customer_id` references `profiles.id`, `transactions.transfer_id` references `transfers.id`). Cascading deletes are used in some cases (e.g., deleting a profile might cascade to delete their accounts).
*   **Authentication Design:**
    *   User authentication is managed by **Supabase Auth**.
    *   It uses **JSON Web Tokens (JWTs)** for session management. Upon successful login, a JWT is issued to the client, which is then included in subsequent requests to authenticate API calls.
    *   The `AuthContext.tsx` on the frontend is responsible for managing the user's authentication state and JWT.
*   **Authorization Design:**
    *   Authorization is primarily enforced using **Row Level Security (RLS)** policies in PostgreSQL, configured via Supabase.
    *   The migration script (`20240729120000_add_core_tables_and_rls.sql`) explicitly defines RLS policies for `accounts`, `transfers`, `statements`, and `transactions` tables. These policies ensure that users can only access or modify data they own or are permitted to see (e.g., "Users can view their own accounts").
    *   Role-based access control is also implemented at the application level (e.g., distinguishing between regular users and administrators using `ProtectedRoute` component with `requireAdmin` prop on the frontend, which would gate access to admin-specific routes and features). Backend RLS policies would also typically consider roles if specific admin privileges beyond data ownership are needed at the database level.

---

## 3. Security Measures and Implementation

Security is a critical aspect of the CCMC Bank Web Application, with measures implemented at both the frontend and backend levels.

### 3.1. Frontend Security

*   **Cross-Site Scripting (XSS) Prevention:** React, by default, escapes JSX content, which helps mitigate XSS attacks by preventing the direct injection of arbitrary HTML/JavaScript.
*   **Token Handling and Session Management:**
    *   Authentication tokens (JWTs) obtained from Supabase are managed by the `AuthContext.tsx`.
    *   These tokens are securely stored (typically in memory or browser's secure storage like `localStorage` or `sessionStorage`, though specific storage choice by `AuthContext` isn't detailed here) and sent with API requests to authenticate users.
    *   The application should ensure tokens are transmitted securely via HTTPS.
*   **Client-Side Routing Controls:** `ProtectedRoute.tsx` and `GuestRoute.tsx` prevent unauthorized users from accessing certain parts of the application by checking authentication status and admin roles before rendering routes.
*   **Input Validation (Client-Side):** While primary validation occurs on the backend, client-side validation is implemented in forms (e.g., using form libraries or custom logic within components) to provide immediate feedback to users and reduce invalid requests to the server.

### 3.2. Backend Security (Supabase)

*   **Authentication:**
    *   **Supabase Auth** provides robust user authentication, handling user registration, login, and password management (including secure password hashing).
*   **Authorization and Access Control:**
    *   **Row Level Security (RLS):** This is a cornerstone of the application's data security. RLS policies are defined directly in the PostgreSQL database (as seen in `supabase/migrations/20240729120000_add_core_tables_and_rls.sql`). These policies restrict database access at the row level, ensuring users can only interact with data they are explicitly authorized to access (e.g., a user can only view their own `accounts` or `transactions`).
    *   **Role-Based Access Control (RBAC):** While RLS handles data access, application-level roles (like 'admin') are used to control access to specific features or sections (e.g., the `/admin` routes protected by `requireAdmin` in `ProtectedRoute.tsx`). Supabase RLS can also be made role-aware by checking `auth.role()` if roles are configured in Supabase Auth.
*   **Data Encryption:**
    *   **Data in Transit:** All communication between the client (browser) and Supabase (including API calls and database interactions) is secured using **HTTPS/SSL/TLS**, encrypting data during transmission.
    *   **Data at Rest:** Supabase manages the underlying PostgreSQL database and typically provides encryption at rest for all data stored.
*   **API Security:**
    *   Supabase automatically generates secure RESTful API endpoints. Access to these endpoints is controlled by authentication (JWTs) and RLS policies.
*   **Database Security:**
    *   Direct database access from the public internet is generally restricted. Interaction is primarily through the Supabase API layer.
    *   The migration file shows explicit `REVOKE ALL ON TABLE ... FROM public, anon, authenticated;` followed by specific `GRANT` statements to `authenticated` users, which is good practice for defining least privilege.

### 3.3. General Security Practices

*   **Environment Variables:** Sensitive information like API keys and database connection strings (though Supabase client keys are often public, the service key for admin operations must be kept secret) should be managed using environment variables (e.g., via `.env` files for local development, and secure environment variable management in deployment).
*   **Dependency Management:** Regularly updating dependencies (npm packages) helps mitigate vulnerabilities found in third-party libraries. Tools like `npm audit` can be used to identify known vulnerabilities.
*   **Error Handling:** The application implements error handling (e.g., in `Dashboard.tsx`'s data fetching) to prevent leaking sensitive error details to the client while providing user-friendly messages.
*   **Regular Security Audits:** (Recommended) Periodic security audits and penetration testing would further enhance the application's security posture.

---
