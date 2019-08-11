# NodeTask

Available Scripts
In the project directory, you can run:

npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

# APIS

`http://localhost:3000/getEnvironment/:process`
• Request Params - Process Name
• Response - JSON of key-value from ENV file of the requested process

`http://localhost:3000/setEnvironment/:process/:key/:value`

• Request Params - Process Name, Key to be set in ENV file, Value of key to
be set in ENV file
• Response - JSON of key-value from updated ENV file of the requested
process
