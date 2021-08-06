## Introduction

#### Project Topic

Value Eats

#### Group member

| Name         | Student ID | Role                               |
| ------------ | ---------- | ---------------------------------- |
| Haonan Zhang | z5151812   | Scrum Master & Front-end Developer |
| Hanrui Tao   | z5237012   | Front-end Developer                |
| Jiaming Liu  | z5190422   | Back-end Developer                 |
| Jian Li      | z5181781   | Back-end Developer                 |
| Yingda Chen  | z5240335   | Back-end Developer                 |

## Requirements
* Node.js
* Python3
* Pipenv
* Django 3.2.4
* Pyjwt 2.1.0

## Getting started (Tested successfully in UNSW CSE vlab environment)
1. Clone the project to your machine ```[git clone https://github.com/COMP3900-9900-Capstone-Project/capstoneproject-comp9900-w18b-developers.git]```
2. Navigate into the Back-end directory ```[cd Backend]```
3. Creates a virtual environment ```[python3 -m venv env]```
4. Activate the virtual environment ```[source env/bin/activate]```
   - If on a Windows terminal, run ```[env\Scripts\activate.bat] ```
   - If on Windows but using a bash terminal, run ```[source env/Scripts/activate]```
   - Otherwise, run ```[source env/bin/activate]```
5. Install the dependencies ```[pip install -r requirements.txt]```
6. Back ```[cd ..]```
7. Navigate into the Front-end directory ```[cd Frontend]```
8. Install the dependencies ```[npm install]```

## Run the application
You will need two terminals pointed to the Front-end and Back-end directories to start the servers for this application.

1. Run this command to start the back-end server in the ```[Backend]``` directory: ```[python manage.py runserver]``` (You have to run this command while you are sourced into the virtual environment)
2. Run this command to start the front-end development server in the ```[Frontend]``` directory: ```[npm start]``` (This will start the front-end on the address [localhost:3000](http://localhost:3000))

## Built With

* [React](https://reactjs.org) - A progressive JavaScript framework.
* [Python](https://www.python.org/) - A programming language that lets you work quickly and integrate systems more effectively.
* [Django](http://djangoproject.org/) - A high-level Python Web framework that encourages rapid development and clean, pragmatic design.

