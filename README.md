# NearZero

A minimalist, privacy-first task manager that visually brings your deadlines to life.

NearZero is a browser-based task management web application built with React. Its core feature is its focus on **urgency visualization**. Tasks aren't just static items; they visually change color, pulse, and animate as their deadlines approach, giving you an at-a-glance understanding of what needs your attention.

This is a **privacy-first** application. All data is stored *only* in your browser's Local Storage. There are no accounts, no logins, and no data is ever sent to a server.

## Key Features (Version 1.0)

Based on the V1 design goals, this application will include:

* **Visual Urgency:** Tasks automatically change color in a smooth gradient (green $\rightarrow$ yellow $\rightarrow$ orange $\rightarrow$ red) as their deadline gets closer.
* **Dynamic Animations:** Tasks due within an hour will have a "subtle pulse animation," and overdue tasks will "blink or shake" to grab attention.
* **100% Local Storage:** All task data persists in your browser. No sign-up is required, and your data stays with you.
* **Full Task Management:** Create, view, edit, and delete tasks with titles, descriptions, deadlines, and priorities.
* **Advanced Sorting:** Sort your list by the default (deadline) or by priority (High, Medium, Low).
* **Responsive Design:** A clean, multi-column layout that adapts to both desktop and mobile screens.
* **Modal View:** Click any task to open a modal showing its full details and providing quick actions like "Edit" or "Delete".

## ️ Core Technology

* **Frontend:** [React](https://react.dev/) (bootstrapped with [Vite](https://vitejs.dev/))
* **Storage:** Browser `window.localStorage`
* **Planned Libraries:**
    * **Date/Time:** `dayjs` or `date-fns` for reliable UTC date parsing and formatting.
    * **Unique IDs:** `uuid` for generating unique task IDs.
    * **Animations:** `framer-motion` (optional) for smooth transitions.

## Getting Started

This project was bootstrapped with Vite. To get it running locally:

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (or your package manager of choice)

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Qrofeus/near-zero.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd near-zero
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
5.  Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

## License

This project is open-source and available under the MIT License.