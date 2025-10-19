# 🐍 Learning-Django-ACI

Welcome to **Learning-Django-ACI**, a project built to explore and master the **Django Framework** while following best practices in backend web development.  
This repository is part of the learning and implementation journey at **ACI PLC**, focusing on understanding Django’s core features, design patterns, and scalable backend architecture.

---

## 🚀 Project Overview

The goal of this project is to:
- Understand the fundamentals of **Django** (Models, Views, Templates, and URLs).
- Learn **Django ORM**, **Admin panel customization**, and **Authentication system**.
- Build and expose **REST APIs** using **Django REST Framework (DRF)**.
- Follow **industry conventions** for folder structure, naming, and modular app design.
- Gain practical experience in deploying Django applications in a production environment.

---

## 🧩 Features

- ✅ User registration and authentication  
- ✅ Admin dashboard  
- ✅ CRUD operations using Django ORM  
- ✅ RESTful API using Django REST Framework  
- ✅ Pagination, filtering, and search functionality  
- ✅ Environment-based settings (development/production separation)  

---

## 🏗️ Tech Stack

| Component | Technology |
|------------|-------------|
| **Framework** | Django 5.x |
| **API** | Django REST Framework |
| **Database** | SQLite / PostgreSQL |
| **Authentication** | Django built-in auth system |
| **Language** | Python 3.10+ |
| **Frontend (optional)** | HTML, CSS, JS or React.js |
| **Deployment** | Docker / Gunicorn / Nginx (optional) |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository
    ``bash
    git clone https://github.com/<your-username>/Learning-Django-ACI.git
    cd Learning-Django-ACI
    
### 2️⃣ Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate     # For Linux/Mac
    venv\Scripts\activate        # For Windows

### 3️⃣ Install dependencies
    pip install -r requirements.txt

### 4️⃣ Run migrations  
    python manage.py makemigrations
    python manage.py migrate
    
### 5️⃣ Create a superuser
    python manage.py createsuperuser

### 6️⃣ Run the development server
    python manage.py runserver
    
## 🧪 Example API Endpoints

Method	Endpoint	Description
POST	/api/register/	Register a new user
POST	/api/login/	Log in a user
GET	/api/tasks/	Retrieve task list
POST	/api/tasks/	Create a new task
PUT	/api/tasks/{id}/	Update a specific task
DELETE	/api/tasks/{id}/	Delete a specific task

## 🧠 Learning Goals

- Understand Django’s request-response cycle.
- Implement Model relationships: One-to-One, One-to-Many, Many-to-Many.
- Learn about query optimization, serializers, and views.
- Apply SOLID principles and DRY practices.
- Gain insight into API testing using Postman.
- Prepare for real-world Django project development.

## 🧰 Useful Commands

python manage.py startapp <app_name>    # Create a new Django app
python manage.py createsuperuser        # Create admin user
python manage.py collectstatic          # Collect static files
python manage.py shell                  # Open interactive Django shell

## 🧑‍💻 Author

Khan Atik Faisal
Software Engineer at ACI PLC
