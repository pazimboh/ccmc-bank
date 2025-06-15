# User Manual: CCMC Bank Web Application

## Table of Contents

1.  [Introduction](#introduction)
2.  [User Features](#user-features)
    *   [Account Management](#account-management)
        *   [Registration and Login](#registration-and-login)
        *   [Profile Management](#profile-management)
        *   [Settings](#settings)
    *   [Dashboard Overview](#dashboard-overview)
    *   [Accounts Section](#accounts-section)
    *   [Transfers Section](#transfers-section)
    *   [Loan Applications](#loan-applications)
    *   [Pending Approval Page](#pending-approval-page)
3.  [Admin Features](#admin-features)
    *   [Admin Dashboard Overview](#admin-dashboard-overview)
    *   [Customer Management](#customer-management)
    *   [Loan Request Management](#loan-request-management)
    *   [Transaction Monitoring](#transaction-monitoring)
    *   [Reports](#reports)
    *   [Audit Log](#audit-log)
    *   [Security](#security)
    *   [Settings (Admin)](#settings-admin)
4.  [Getting Started](#getting-started)
    *   [For New Users (Customers)](#for-new-users-customers)
    *   [For Administrators](#for-administrators)
    *   [Technical Setup (For Developers/Local Environment)](#technical-setup-for-developerslocal-environment)
5.  [Troubleshooting / FAQ](#troubleshooting--faq)

## Introduction

Welcome to the CCMC Bank Web Application! This document serves as a comprehensive guide to understanding and utilizing the features of our online banking platform.

The CCMC Bank application is designed to provide users with a secure and convenient way to manage their finances. It allows customers to view their account balances, track transactions, apply for loans, and manage their personal information. The application also includes a robust admin panel for bank staff to manage customers, loan applications, and monitor system activity.

This application is built using modern web technologies including:

*   Vite
*   TypeScript
*   React
*   shadcn-ui (for UI components)
*   Tailwind CSS (for styling)
*   Supabase (for backend services and database)

## User Features

This section details the features available to regular users of the CCMC Bank Web Application.

### Account Management

Managing your account settings and personal information is straightforward.

#### Registration and Login

*   **Registration:** New users can create an account by navigating to the "Open an Account" or "Sign Up" page, typically accessible from the homepage (`/auth?view=sign_up`). You will be required to provide necessary personal information to set up your account.
*   **Login:** Existing users can sign in through the "Sign In" page (`/auth`). You'll need to enter your registered credentials (e.g., email and password).
*   **Authentication Routes:** The main authentication page is `Auth.tsx` which handles both login and registration forms. Specific components like `Login.tsx` and `Register.tsx` might be part of this flow or separate, but the entry point is typically via `/auth`.

#### Profile Management

*   Once logged in, you can manage your user profile information via the "Profile" page (accessible from the dashboard, likely navigating to `/profile`).
*   This section allows you to update personal details. (Details based on `src/pages/Profiles.tsx`)

#### Settings

*   The "Settings" page (accessible from the dashboard, likely navigating to `/settings`) allows you to configure various application preferences.
*   This may include security settings like changing your password or managing notification preferences. (Details based on `src/pages/Settings.tsx`)

### Dashboard Overview

Upon logging in, you will be directed to your personal dashboard (`/dashboard`), which provides a snapshot of your financial status and quick access to various banking operations.

Key components of the dashboard include:

*   **Welcome Message:** A personalized greeting.
*   **Total Balance:** Displays the aggregate balance of all your accounts.
*   **Monthly Spending:** Shows your total spending for the current month.
*   **Savings Goal:** (If implemented and active) Tracks progress towards any savings goals you have set. Currently, this feature might be marked as "coming soon."
*   **Quick Actions:** Buttons for common tasks such as:
    *   "Add Account": To initiate the process of opening a new account.
    *   "Make Transfer": To quickly navigate to the funds transfer page.
*   **Your Accounts:** A summary list of your bank accounts, showing names, account numbers, and current balances. Clicking on an account or a "View All Accounts" button will typically navigate you to a more detailed accounts page. (Based on `src/components/dashboard/AccountSummary.tsx` and its usage in `src/pages/Dashboard.tsx`).
*   **Recent Transactions:** A list of your latest transactions, showing descriptions, dates, amounts, and types (e.g., deposit, withdrawal, purchase). (Based on `src/components/dashboard/RecentTransactions.tsx`).

The dashboard is typically organized with tabs for "Overview", "Accounts", and "Transfers" for easy navigation to more detailed sections.

### Accounts Section

This section provides detailed information about your accounts and allows you to manage them. It's typically accessible via an "Accounts" tab or link from the main dashboard.

*   **View All Accounts:** The main page of this section lists all your accounts (e.g., checking, savings). For each account, you can typically see:
    *   Account Name
    *   Account Number
    *   Available Balance
*   **Account Details:** Clicking on a specific account (often via a "Manage" or "Details" button, as seen in `src/components/dashboard/AccountSummary.tsx` which links to `/accounts/{account.id}`) will take you to a page with more detailed information, including:
    *   A more comprehensive transaction history for that specific account.
    *   Options to perform account-specific actions.
*   **View Statements:** You can generate and view your account statements from the "Statements" page (navigating to `/statements`). This page allows you to select an account and a period to generate the statement. (Based on `src/pages/Statements.tsx`).
*   **Open New Account:** An option to "Open New Account" might be present, allowing you to apply for additional bank accounts.

### Transfers Section

The "Transfers" section, accessible from the main dashboard, allows you to move money. (Functionality described as per `src/pages/Dashboard.tsx` under the "Transfers" tab, and potentially `src/pages/Payments.tsx`).

*   **Make a Transfer (Between Your Accounts):**
    *   This feature allows you to transfer funds between your own accounts linked to the CCMC Bank profile.
    *   You will typically need to select the source account, the destination account, and the amount to transfer.
    *   *Note: The UI indicates that full implementation of this feature is dependent on backend connectivity.*
*   **Pay Someone (External Payments):**
    *   This feature enables you to send money to other individuals or businesses.
    *   You may need to provide recipient account details (e.g., account number, bank name) and the amount to transfer.
    *   The "Payments" page (`/payments`) is dedicated to this functionality.
    *   *Note: The UI indicates that full implementation of this feature is dependent on backend connectivity.*

### Loan Applications

CCMC Bank application allows users to apply for loans and track their status.

*   **Apply for a Loan:**
    *   Users can apply for new loans through the "Apply for Loan" page (navigating to `/apply-loan`). (Based on `src/pages/ApplyLoan.tsx`).
    *   The application process will likely require you to fill out a form with details about the loan type, amount, your financial information, and any other required documentation.
*   **View Loan Status:**
    *   You can track the status of your submitted loan applications on the "Loans" page (navigating to `/loans`). (Based on `src/pages/Loans.tsx`).
    *   This page will typically display a list of your loans and their current statuses (e.g., pending, approved, rejected, active).

### Pending Approval Page

*   After registration, or certain sensitive actions, you might be directed to a "Pending Approval" page (`/pending-approval`). (Based on `src/pages/PendingApproval.tsx`).
*   This page indicates that your account or a specific request is under review by the bank administration before you can gain full access or before the request is processed.
*   You may need to wait for confirmation from the bank. Further instructions or contact information might be provided on this page.

## Admin Features

This section outlines the features available to administrators of the CCMC Bank Web Application, accessible via the Admin Dashboard (`/admin`).

### Admin Dashboard Overview

The Admin Dashboard serves as the central hub for bank administrators, providing a summary of key metrics and access to various management modules. (Based on `src/pages/AdminDashboard.tsx`).

Key components of the admin overview include:

*   **Total Customers:** Displays the total number of registered users in the system.
*   **Pending Applications:** Shows the count of loan applications awaiting review and approval.
*   **Active Loans:** Displays the total number of currently active loans.
*   **System Status:** Indicates the operational health of the application (e.g., "Operational").
*   **Recent Applications:** A list of the most recent loan applications submitted by users, often showing customer name, loan type, amount, and status. This allows for quick review and access.
*   **System Alerts:** Important notifications for administrators, such as the number of pending applications requiring review, system health updates (e.g., "System running normally," "Daily backup completed successfully").

### Customer Management

Administrators can manage customer accounts through the "Customers" tab on the Admin Dashboard. (Based on `src/components/admin/AdminCustomerTable.tsx` and `src/components/admin/AddCustomerModal.tsx`).

Key functionalities include:

*   **View Customers:** A table lists all registered customers, typically showing details like name, email, customer ID, and account status.
*   **Search Customers:** A search bar allows admins to find specific customers quickly.
*   **Filter Customers:** Options to filter the customer list based on various criteria (e.g., account status, registration date) may be available.
*   **Add Customer:** Administrators can manually add new customer accounts to the system using an "Add Customer" modal. This typically involves entering the customer's personal information and account details.
*   **Edit Customer Details:** (Implied) Admins likely have the ability to view and modify customer profile information, manage account status (e.g., activate, suspend), and potentially reset passwords.

### Loan Request Management

This module, typically found under the "Loan Applications" or "Loans" tab, allows administrators to oversee and process loan applications submitted by users. (Based on `src/components/admin/AdminLoanRequests.tsx`).

Core features include:

*   **View Loan Applications:** A list or table displays all loan applications with details such as applicant name, loan type, amount requested, submission date, and current status (e.g., pending, approved, rejected).
*   **Review Application Details:** Admins can click on an application to view comprehensive details, including applicant information and any submitted documents.
*   **Approve/Reject Applications:** Administrators have the authority to approve or reject loan applications based on their review and the bank's lending criteria.
*   **Update Loan Status:** The status of the loan application can be updated throughout its lifecycle.
*   **Filtering and Sorting:** Options to filter applications (e.g., by status, date, loan type) and sort them are usually available for easier management.

### Transaction Monitoring

The "Transactions" or "Transaction Audit Log" tab provides administrators with tools to monitor and audit all financial transactions occurring within the system. (Based on `src/components/admin/AdminTransactionLog.tsx`).

Key aspects include:

*   **View All Transactions:** A comprehensive log of all transactions across all customer accounts.
*   **Transaction Details:** Each entry in the log typically shows the transaction ID, date, type (e.g., deposit, withdrawal, transfer), amount, source account, destination account, and current status.
*   **Search and Filter:** Administrators can search for specific transactions (e.g., by transaction ID, customer ID, date range) and apply filters (e.g., by transaction type, amount range, status) to investigate specific activities or identify patterns.
*   **Audit Trail:** This log serves as an important audit trail for compliance and security purposes, helping to track the flow of funds and identify any suspicious or unauthorized activities.

### Reports

The "Reports" section allows administrators to generate various reports for analysis, decision-making, and compliance purposes. (Based on `src/components/admin/AdminReports.tsx`).

While specific reports may vary, common types of reports that could be available include:

*   **Financial Reports:** Summaries of overall financial performance, such as total deposits, withdrawals, loan disbursements, and revenue.
*   **Customer Activity Reports:** Insights into customer behavior, such as transaction volumes, account growth, and popular services.
*   **Loan Portfolio Reports:** Analysis of the loan portfolio, including outstanding balances, delinquency rates, and loan performance by type.
*   **System Performance Reports:** Data on application uptime, transaction processing times, and other system health indicators.
*   **Customizable Reporting:** Admins may be able to define parameters (e.g., date ranges, specific accounts or products) to generate custom reports tailored to their needs.

### Audit Log

The "Audit Log" section provides a chronological record of significant actions performed within the admin panel or critical system events. This is distinct from the transaction log, focusing more on administrative changes and system activities. (Based on `src/components/admin/AdminAuditLog.tsx`).

Key features and purposes include:

*   **Tracking Admin Actions:** Logs actions taken by administrators, such as customer account modifications, changes to loan application statuses, updates to system settings, and report generation.
*   **System Events:** Records important automated system events, which might include security alerts, backup completions, or system errors.
*   **Details Logged:** Each audit log entry typically includes a timestamp, the user or system process that performed the action, the type of action, and relevant details or parameters of the event.
*   **Security and Compliance:** This log is crucial for security monitoring, forensic analysis in case of incidents, and demonstrating compliance with regulatory requirements.
*   **Search and Filtering:** Similar to other logs, it likely offers search and filter capabilities to help admins find specific events or analyze patterns.

### Security

The "Security" section in the Admin Dashboard is dedicated to managing and monitoring the security aspects of the application. (Based on `src/components/admin/AdminSecurity.tsx`).

Potential features in this section include:

*   **View Security Alerts:** A dashboard or log of security-related events or alerts, such as failed login attempts, potential fraudulent activities, or system vulnerabilities.
*   **Manage Access Control:** Configuration of user roles and permissions, though this might also be part of general settings.
*   **IP Whitelisting/Blacklisting:** Options to manage IP addresses for enhanced security.
*   **Security Settings:** Configuration of security parameters like password policies, multi-factor authentication (MFA) settings, and session timeout rules.
*   **View System Health:** Information on system integrity, security scans, and compliance status.

### Settings (Admin)

The "Settings" tab in the Admin Dashboard allows administrators to configure various system-wide parameters and application settings. (Based on `src/components/admin/AdminSettings.tsx`).

This section may include options to manage:

*   **General Application Settings:** Configuration of application name, logo, contact information, or default behaviors.
*   **Email Templates:** Customization of automated email notifications sent to users (e.g., registration confirmations, password resets).
*   **Financial Settings:** Parameters related to financial operations, such as default currency, interest rate configurations (if applicable), or transaction fee structures.
*   **Integration Settings:** Configuration for third-party service integrations (e.g., payment gateways, communication services).
*   **Maintenance Mode:** Options to put the application into maintenance mode for updates or troubleshooting.
*   **API Keys and Webhooks:** Management of API keys for external access or webhook configurations if the application provides such integrations.

## Getting Started

This section will guide you through the initial steps to begin using the CCMC Bank Web Application.

### For New Users (Customers)

1.  **Accessing the Application:**
    *   Open your web browser and navigate to the application's main URL (this would be the deployed URL of the application).
    *   You will land on the homepage (`Index.tsx`), which provides options to sign in or open a new account.

2.  **Creating an Account:**
    *   Click on the "Open an Account" or "Sign Up" button. This will take you to the registration page (`/auth?view=sign_up`).
    *   Fill out the required information, which may include your name, email address, desired password, and other personal details.
    *   Submit the registration form.

3.  **Pending Approval (If Applicable):**
    *   After registration, your account might be subject to review and approval by bank administrators. You may be directed to a "Pending Approval" page (`/pending-approval`).
    *   Once your account is approved, you should receive a notification (e.g., via email) and can then proceed to log in.

4.  **Logging In:**
    *   Navigate to the "Sign In" page (`/auth`).
    *   Enter your registered email address and password.
    *   Click the "Sign In" button to access your dashboard.

5.  **Exploring Your Dashboard:**
    *   Once logged in, take some time to familiarize yourself with the dashboard. You can view your account summary, recent transactions, and navigate to other sections like "Accounts," "Transfers," and "Loans."

### For Administrators

1.  **Accessing the Admin Panel:**
    *   Administrators will typically log in through the same main login page (`/auth`) using their admin credentials.
    *   Once logged in, authorized administrators will have access to the Admin Dashboard, usually by navigating to the `/admin` path.

2.  **Navigating Admin Features:**
    *   The Admin Dashboard provides access to various modules for managing customers, loans, transactions, reports, and system settings. Use the navigation menu (often on the left side) to switch between different sections.

### Technical Setup (For Developers/Local Environment)

*   For instructions on how to clone the repository, install dependencies, and run the project locally for development or testing purposes, please refer to the `README.md` file in the project's root directory. This typically involves commands like `git clone`, `npm i`, and `npm run dev`.

## Troubleshooting / FAQ

This section addresses common questions and issues you might encounter while using the CCMC Bank Web Application.

**Q1: I forgot my password. How can I reset it?**
*   A1: On the login page (`/auth`), there is usually a "Forgot Password?" link. Click on it and follow the instructions. You'll typically need to enter your registered email address, and a password reset link will be sent to you.

**Q2: I'm unable to log in even with the correct credentials.**
*   A2:
    *   Ensure your Caps Lock key is off.
    *   Double-check that you are using the correct email address and password.
    *   Your account might be temporarily locked due to multiple failed login attempts. Wait for a few minutes and try again.
    *   If you are a new user, your account might still be pending approval.
    *   If problems persist, contact customer support.

**Q3: Why can't I see my latest transaction?**
*   A3: Some transactions might take a few moments to reflect in your account summary due to processing times. If a significant amount of time has passed and the transaction is still missing, please contact customer support.

**Q4: The transfer or payment feature is disabled.**
*   A4: As noted in the "Transfers Section," some functionalities like transfers and payments are dependent on full backend integration. If these features are marked as disabled or "coming soon," they are not yet fully operational. Check back later or look for application updates.

**Q5: How do I update my personal information?**
*   A5: You can usually update your personal details in the "Profile" section, accessible from your dashboard after logging in.

**Q6: (Admin) I can't find a specific customer in the Customer Management table.**
*   A6:
    *   Ensure you have spelled the customer's name or ID correctly in the search bar.
    *   Check if any filters are active that might be hiding the customer. Try clearing all filters.
    *   Verify that the customer's account exists and has not been accidentally deleted or is under a different identifier.

**Q7: (Admin) A system report is not generating or shows an error.**
*   A7:
    *   Ensure the reporting parameters (e.g., date range) are correctly set.
    *   There might be a temporary issue with data retrieval or processing. Try again after a short while.
    *   If the issue persists, check system logs (if accessible) or contact technical support for the application.

**For further assistance, please contact CCMC Bank customer support or your system administrator.**
