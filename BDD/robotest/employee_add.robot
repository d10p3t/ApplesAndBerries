*** Settings ***
Documentation     A test suite with a single test for adding an employee.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Suite Setup       Open Browser To Main Menu
Suite Teardown	  Close Browser
Resource          menu_resource.robot

*** Test Cases ***
Check Add Employee Status
	Go To Employee Panel
    Input EmpName
    Select Status
    Input StartDate
    Input Birthday 
    Select Position
    Input Dependents
    Input Salary
    Submit Form
    Wait Until Page Contains   Apples and Berries Payroll System
    Location Should Be    ${WELCOME URL}
    
    
*** Keywords ***
Input EmpName
    Input Text    name    Chacha${SPACE}BeatBoy

Input StartDate
    Input Text    startdate    12/30/2017

Input Birthday
    Input Text    birthday    12/30/1997

Select Position
	Click Element	xpath=//body/div/div[2]/form/div[3]/div/div		
	Select From List By Index	    position     0

Select Status
	Click Element	xpath=//body/div/div[2]/form/div[3]/div[2]/div
	Select From List By Index	status   0
	
Input Dependents
	Input Text    dependents 	 0

Input Salary
	Input Text	  salary 		18000
	
Go To Employee Panel
    Click Button               xpath=//body/div/div[2]/div[2]/div[2]/div/button
    Wait Until Page Contains   EmployeePanel
    Location Should Be         ${EMPLOY URL}
    Click Button    addemp
    Wait Until Page Contains    Add Employee
    Location Should Be          ${ADD EMPLOY URL}
