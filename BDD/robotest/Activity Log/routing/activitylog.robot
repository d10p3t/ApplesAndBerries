*** Settings ***
Documentation     A test suite with a test case for navigation to the
...				  Activity Log Page.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Library           Selenium2Library
Test Teardown     Close Browser

*** Variables ***
${SERVER}         			localhost:8000
${BROWSER}        			Chrome
${DELAY}          			0.3
${username}       			edrichhans
${password}       			password
${LOGIN URL}      			http://${SERVER}/login
${WELCOME URL}    			http://${SERVER}/
${ACTIVITY LOG URL}			http://localhost:8000/activity_log

*** Test Cases ***
Go To Activity Log
	Open Browser To Main Menu
	Click Element               activity-log
	Wait Until Page Contains    Activity Log
	Location Should Be          ${ACTIVITY LOG URL}

*** Keywords ***
Open Browser To Main Menu
	Open Browser    ${LOGIN URL}    ${BROWSER}
	Maximize Browser Window
	Set Selenium Speed    ${DELAY}
	Input Username
	Input Password
	Submit Credentials
	Wait Until Page Contains   Main Menu
	Location Should Be    ${WELCOME URL}

Input Username
	Input Text    username    ${username}

Input Password
	Input Text    password    ${password}

Submit Credentials
	Click Button    login-button
