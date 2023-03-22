# GREEN-TRACK

## Before you start
1. npm install
2. npm start
3. http://localhost:3000
4. Right click on the browser page to open the Inspect sidebar and turn on mobile mode, select responsive: iPhone 12Pro

## introduction
We intend to create a mobile app which help people obtain a comprehensive understanding of low-carbon lifestyle, and raise the awareness of environment protection starting with themselves. The app is designed to be a footstep tracker which records people's daily walking distance and footsteps. Then the data collected will be calculated and compared with other commuting in carbon-dioxide emission, which indicates the amount of carbon-dioxide emission has been reduced. We also build a "green coin currency" reward system to motivate people to walk with positive feedback. If a user finish the goal in-app, he can get a "coin" and use it to donate to tree planting and other environment protection activities. What is more, the relevant relationship between carbon dioxide emission and forest degeneration(or desertification) would be in the form of charts, which propaganda users a sense of environmental consciousness.

## Modules
npm install echarts
npm install date-fns
npm install @fortawesome/react-fontawesome
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/react-fontawesome
npm install react-select
npm install react-bootstrap

## What are the things that our application actually do?
– Read from an API? 
     Yes. We use the user login and registration interface provided by firebase to quickly implement the authentication function

– Read from a database? 
    Yes. We use firebase to store and query user behaviour records.

– Read from an external JSON source?
    Yes. Most of our data is pulled from the database in real time, and the data the database gives us is in JSON format.

– Use conditional rendering?
    Yes. On Trackpage page we render the data according to the time selected by the user and if data is available we display a list of data for the corresponding date. If not we show a paragraph leading the user to add the record.

– Implement project specific sorting and filtering?
    Yes. The list of data on Trackpage page is arranged in reverse chronological order.
    Also on this page, the 'footprint-type-sum' section, we filter the list by record and calculate the total score corresponding to each type.

– Use a selection of User Interface elements (input box, buttons, drop-down-list, etc.)
    Yes. In the AddFootPrint component, we use drop-down boxes (select) to show the types of behaviour that can be selected, such as walking, bus, no-light, etc. The user can select any of these as the value of the current record type.

– Parent-child communication
    Yes. When adding a ecord, we first pass the list data displayed on the parent component's page(Trackpage) to the child component(AddFootPrint) and insert the record to be added to this list, and finally the child component(AddFootPrint) passes this new list to the parent component(Trackpage), which displays the latest list content.

– Uses multiple components
    Yes. We have Trackpage, AddFootPrint, Login, Register, Order, Me, etc.

– Include backend computation or algorithms (your own)
    Yes. On the Dashboard page, we need to show the total weight of footpoints corresponding to each type for each day in groups. We take the creation time of the record, subtract the timestamp of the first day of the week and divide it by the total number of milliseconds in a day to get the value that is the day of the week for the record.