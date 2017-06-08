*** Settings ***
Documentation     A test suite with a test case for the checking of valid
...				  and invalid entries.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Library           Selenium2Library
Test Template     Check Table Entry
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

*** Test Cases ***			Row		Type							DoneBy			Date
Check Table Entry 1     	2   	Employee added    				edrichhans		June 6, 2017
Check Table Entry 2			3		Employee deleted    			edrichhans		June 6, 2017
Check Table Entry 3			4		Thirteenth Month Pay Issued		edrichhans		June 6, 2017
Check Table Entry 16		17		Employee added					edrichhans		June 7, 2017
Check Wrong Entry			19		Employee added					edrichhans		June 7, 2017
Check Nonexistent Entry		20		Employee added					edrichhans		June 9, 2017

*** Keywords ***
Check Table Entry
	[Arguments]     ${Row}      ${Type}      ${DoneBy}       ${Date}
	Go To Activity Log
	Table Cell Should Contain    activity-log-table    ${Row}    1    ${Type}
	Table Cell Should Contain    activity-log-table    ${Row}    2    ${DoneBy}
	Table Cell Should Contain    activity-log-table    ${Row}    3    ${Date}

Open Browser To Main Menu
	Open Browser    ${LOGIN URL}    ${BROWSER}
	Maximize Browser Window
	Set Selenium Speed    ${DELAY}
	Input Username
	Input Password
	Submit Credentials
	Wait Until Page Contains   Main Menu
	Location Should Be    ${WELCOME URL}

Go To Activity Log
	Open Browser To Main Menu
	Click Element               activity-log
	Wait Until Page Contains    Activity Log
	Location Should Be          ${ACTIVITY LOG URL}

Input Username
	Input Text    username    ${username}

Input Password
	Input Text    password    ${password}

Submit Credentials
	Click Button    login-button
