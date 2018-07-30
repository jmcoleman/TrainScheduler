# TrainScheduler
Train Scheduler

The Train Scheduler allows train routes to be entered and displays all current routes with their estimated arrival times from the current time.


**Problem it solves:** \
The Train Scheduler allows travelers to find train routes in order to make travel plans.  It also gives train administrators the ability to keep all routes up to date in the system and accessible to others immediately with current information.\
**How solved:** \
Train routes that are stored in a Firebase database for real-time access to anyone on the internet.  Trains, their destinations, frequency of travel, next arrival times and the number of minutes away are displayed.  There is capability for new train routes and their route to be entered and stored to the Firebase database.\
**Technical approach:** Leverage Firebase for real-time data storage and access for up to date train routes.

## Getting Started
 
 All references use a CDN.
 This is a Firebase and JavaScript/JQuery project that uses Bootstrap 4.1 with Bootswatch.  Clone the repository locally. Create a Firebase database and update the code to point to this instance.

### Prerequisites

Firebase real-time database is setup.

### Installing

To get a development environment up and running, clone the repository locally.
Ensure that you have the Firebase real-time database setup and update iot to use your access key.

## Running tests

Testing was performed by entering a variety of train routes.  Both valid and invalid data was entered.  The date fields in particular were tested for variations of dates and times.

## Deployment

The project is deployed to GitHub pages at https://jmcoleman.github.io/TrainScheduler/

## Built With

Firebase, JQuery, Bootstrap, Bootswatch, and Font Awesome

## Contributing

N/A

## Versioning

This is version 1.0.

## Authors

* **Jenni Coleman** - *Initial project creation*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
