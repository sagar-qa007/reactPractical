# This project has all the details for the requirement given.

## How to run project:
1. Clone the repository.
2. Open two terminals for frontend and backend.
3. Move to the respective folder in each terminal. `frontend` and `backend`
4. Now go to the frontend terminal and run the commands below. This will start local react based web service in frontend:
    ### `npm install`
    ### `npm start`
5. Then go to the backend terminal and run the commands below. This will start our backend service. Note: please refresh the frontend web page to see data.
    ### `pip3 install -r requirements.txt`
    ### `python .\main.py`
6. Now the user is ready to perform actions and it is saved in a temporary database so on each new restart of backend server data will be refreshed.

Task done as per document:

## 1 : Create frontend app with gif data and do following task:
- [x] Load JSON file with data.
- [x] Display the content as 5 cards, 3 in the first row and 2 in the second row.
- [x] Display a placeholder spinner for each image that is loading.
- [x] Make the application so the cards can be reordered via drag and drop.
- [x] Make so clicking on a card displays the image as an overlay in 
middle of the webpage. Make so pressing ESC closes the image.
- [x] Added "Save" and "Cancel" button functionality.
- [x] Alert pop up for save and cancel features.
- [x] Added the last saved display feature.
- [x] Functional testing.


## 2 : Create backend app with api to perform actions and do following task:

- [x] Create a PostgreSQL / SQLite table that can hold the data that was in the static
json file from part 1 in a sensible way.
- [x] Build a REST API that can fetch the data from this table and add data to this
table with Starlette.
- [x] Added Swagger support for API documentation.
- [x] Added Add/Edit/Delete/Update apis as well for future scopes.
- [x] Functional testing process.



## 3 : Trying api and some more setup

- [x] Call the API from your front end application to display the same grid.
- [x] Also feel free to allow any domains and ports for CORS
- [x] Have the frontend call the REST API for saving every five seconds (not every action).
Display a loading spinner whenever it is saving, and how long has passed since the last
save. Avoid saving if no changes have been made. (saving loader is very quick)

## 4 : Deployment

- [x] Creation of Dockerfile for frontend and backend.
- [x] Docker compose file creation and here how we can use it:

    - To deploy changes with build:
    ### `docker-compose up -d --build`
    - To close the deployment:
    ### `docker-compose down`
    - To tail the logs the deployment:
    ### `docker-compose logs -t -f --tail 100`

Developed the api as working independently and quickly. Starlette allowed me to set up api with a proper modular based approach.

## 5 : General Questions 

APIs for other features :

>For fetching the data with pagination : 
```
curl -X GET "http://127.0.0.1:5620/documents?page=1&per_page=20"


```


>For updating the data:

```
curl -X POST http://127.0.0.1:5620/documents -H "Content-Type: application/json" -d '{
  "type": "Report",
  "title": "Annual Report",
  "position": 1
}'

```


>For delete the data :

```
curl -X DELETE http://127.0.0.1:5620/documents -H "Content-Type: application/json" -d '{
  "id": 1
}'

```

>For updating values in data: 
```
curl -X PUT http://127.0.0.1:5620/documents -H "Content-Type: application/json" -d '{
  "id": 1,
  "position": 2
}'
```

## Future scope:

- Adding more components and its test cases.
- Have delete/update/add features.

