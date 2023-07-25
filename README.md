# IOT Mongo Flask and React vite with Login create nodes
<p align="justify">
IOT Flask REST API with MongoDB with mongoengine  where there is a login and register (you can change password and email, delete account) where each user can create his own node by giving the unique device code and name, the data is displayed in a table and line graph. (the operation of creating nodes in the database, each node has its own table).
</p>

<p align="center">
  <img src="README-images/show-total.PNG" alt="StepLast">
</p>

___

<p align="justify">
First create an account where you must create a username, password ("Must include at least one number.", "Must include at least one lowercase letter,"Must include at least one lowercase letter.", "Must include at least one uppercase letter.", "Must include at least one uppercase letter.","Must include at least one uppercase letter.", "Must include at least one uppercase letter.", "Must include at least one uppercase letter.","Must include at least one special character.", "Must include at least one special character.", "Must include at least one special character.","The length of the password must be equal to or greater than 8 characters.","Must not contain blank spaces.") Confirm your password and enter an email address.
</p>

<p align="center">
  <img src="README-images/loginup.PNG" alt="Step1">
</p>

<p align="justify">
In login enter your username and password, click on the "Login" button.
</p>

<p align="center">
  <img src="README-images/login.PNG" alt="Step2">
</p>

<p align="justify">

After logging in you will see the home screen where you will see your user name and registration id, in this section you can log out, change your password, delete your account (delete your account and node), and create a new nodes.
</p>

<p align="center">
  <img src="README-images/home.PNG" alt="Step3">
</p>

<p align="justify">

In change password you can change your password and email if required.
</p>

<p align="center">
  <img src="README-images/changepassword.PNG" alt="Step4">
</p>

<p align="justify">
In create nodes , insert a name and the unique code to create the node and the 'home' button returns to the home page.
</p>

<p align="center">
  <img src="README-images/nodes-1.PNG" alt="Step5">
</p>

<p align="justify">
Insert a name and the unique code to create the node and click button "Create"
</p>

<p align="center">
  <img src="README-images/node-2.PNG" alt="Step6">
</p>

<p align="center">
  <img src="README-images/node-3.PNG" alt="Step7">
</p>

<p align="justify">
Collection is created per node in the database 
</p>

<p align="center">
  <img src="README-images\collections.PNG" alt="Step8">
</p>




<p align="justify">
By clicking on "edit" you can modify the name given to the node, and by clicking on "update" you confirm it and the "Cancel Edit" button cancels the edition or modification.
</p>

<p align="center">
  <img src="README-images/node-edit.PNG" alt="Step9">
</p>
<p align="center">
  <img src="README-images/node-edited.PNG" alt="Step10">
</p>


<p align="justify">
When you click on "Show" it shows the IOT device data that is being obtained in this case temperature and humidity if the device is not sending the data to 'http://localhost/tablecode/(code)' nothing will appear but if it is sending the data, the data will appear. for example in this case the code is codigo1 then it would be http://localhost/tablecode/codigo1. 
</p>
<p align="center">
  <img src="README-images/show.PNG" alt="Step11">
</p>

<p align="justify">
When you click on "Show" it shows the data of the IOT device that is being obtained in this case of temperature and humidity, these data are displayed in a table where you can see the 5 rows of data, to see the other data there is the "Siguiente"(NEXT) button where it shows the next data (in 5 rows) and to go back there is the "Anterior"(Previous) button that goes back to the data seen until you reach the first data displayed. The data is also displayed graphically with a line graph where the temperature data is the red line and the humidity data is the blue line, where the x-axis is the id of the data and the y-axis is the value of the data.
</p>
<p align="center">
  <img src="README-images/show-total.PNG" alt="Step12">
</p>

___

<p align="justify">
Display of data from another user 'user2', with unique code 'codigo2'.
</p>
<p align="center">
  <img src="README-images/show-total-2.PNG" alt="Step13">
</p>

___

The code for sending REST data from an IOT device, for example in this case using an ESP32 is in :
[Code IOT ESP32 REST]( https://github.com/diegoperea20/IoT_-internet_of_things-/blob/main/tercer_corte/Taller_6/taller_6_rest/src/main.cpp)

 https://github.com/diegoperea20/IoT_-internet_of_things-/blob/main/tercer_corte/Taller_6/taller_6_rest/src/main.cpp