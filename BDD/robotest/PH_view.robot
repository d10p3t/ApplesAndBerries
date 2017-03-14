*** Settings ***
Documentation     A test suite with a single test for going to PhilHealth page in Control Panel.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Suite Setup       Open Browser To Main Menu
Suite Teardown	  Close Browser
Resource          menu_resource.robot

*** Test Cases ***
Go To Petty Cash Panel
    Click Element              xpath=//body/div/div[2]/div[2]/div[2]/div[3]/div
    Wait Until Page Contains   Control Panel
    Location Should Be         ${CONTROL PANEL URL}
    Click Element              xpath=//body/div/div[2]/div[2]/div[3]/div[3]/div
    Wait Until Page Contains   PH View
    Location Should Be         ${PHILHEALTH URL}
    Go Back Home
