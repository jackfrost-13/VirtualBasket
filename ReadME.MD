## Project Setup

### Method 1 - Use Live Server 
    Live Server is an extension for VS Code.
    1. Open project in VS Code.
    2. Install Live Server Extension.
    3. Right click on index.html file from Explorer Window and click on Open with Live Server.
    4. This will open a localhost window in your default browser with the app already running.

### Method 2 - Use HTTP Server  
    Using http-server module from node 
    1. Install npm server using following command.
        npm install --global http-server
    2. Open command prompt from the project directory and run the following command.
        http-server
    3. This will give the url and port number to run the project locally.


## UI Behaviour

User can search and scan for items using the 2 buttons provided at the bottom of the app.

### Search
    1. Enter barcode number for an item and click the search button or press Enter.
    2. If the barcode is correct, the item is displayed
    and it also shows the current quantity of the same item in the cart.
    3. User can modify the quantity of the item using + and - buttons.
    4. User can search and add various items.
    5. Closing the dialog will automatically modify the cart with all chosen items.
    6. If barcode number is incorrect, an error message is displayed.
    7. Clear search button will clear the input field and the search results. (This will not affect the other actions already taken by the user, it will just clear the results section of the dialog).

### Scan
    1. User first needs to click on the "Request Permission Button" and grant permission to use camera for scanning.
    2. User then needs to click on "Start Scanning" to start the scan.
    3. If the barcode is correct, then the item is displayed
    and it also shows current quantity of the same item in the cart. 
    4. User can modify the quantity of the item using + and - buttons.
    5. User can scan another item with the "Scan" Button provided in the dialog.
    6. Closing the dialog will automatically modify the cart with all chosen items.
    7. If barcode is incorrect, an error message is displayed.

### Home Page
    1. Individual items and total cost of each item(price * quantity) which are already present in the cart are shown here.
    2. User can modify the quantity of each item using + and - buttons.
    3. Total cost of the cart is displayed at the bottom.
    4. Buttons to Scan and Search for items is at the bottom of the screen.
    5. If quantity of an item is reduced to 0, it will be removed from the cart.

### Reused Components
    1. The Dialog has been reused for both scan and search.
    2. The quantity component which includes '+' , '-' and quantity number has been reused throughout the app (Results in search, scan, and the cart).
    3. The Results showing mechanism for scan and search is reused. In both cases, the QR code number is used to get results. In one case via the Scanner and in the other case via the input field.


### External Libraries Used
 [HTML5 QR Code Scanner](https://github.com/mebjas/html5-qrcode) 
 
    It is an HTML QR code scanner

    Limitations:
    1. Requests for permission everytime it is triggered. 
    2. Needs an explicit click to start scanning after getting permission.
    3. Scan failure results (If we search for something which is not a QR code) in a null point exception in their code, which is why I have not implemented this part. It doens't time out and keeps scanning unless it is explicitly closed.






