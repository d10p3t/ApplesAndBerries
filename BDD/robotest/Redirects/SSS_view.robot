*** Settings ***
Documentation     A test suite with a single test for going to SSS page in Control Panel.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Suite Setup       Open Browser To Main Menu
Suite Teardown	  Close Browser
Resource          menu_resource.robot

*** Test Cases ***
Go To Petty Cash Panel
    Click Element              control-panel-module-button
    Wait Until Page Contains   Control Panel
    Location Should Be         ${CONTROL PANEL URL}
    Click Element              SSS-module-button
    Wait Until Page Contains   SSS View
    Location Should Be         ${SSS URL}
    Go Back Home
