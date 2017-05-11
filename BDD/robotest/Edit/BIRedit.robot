*** Settings ***
Documentation     A test suite with a single test for editing info of BIR value.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Test Template     Check Edit BIR Status
Resource          menu_resource.robot

*** Test Cases ***      Value
No Value       			${EMPTY}
Zero Value 				0
Decimal Value           2.2
Negative Value          -2.2
Large Value             99999999999999

*** Keywords ***        
Check Edit BIR Status
	[Arguments]    ${value}
    Open Browser To Main Menu
    Open BIR Table
    BIR Values Update    	 ${value}
    Location Should Be       ${WELCOME URL}

Open BIR Table
    Click Element    check-voucher-module-button
    Location Should Be     ${UPDATE TABLES}
    Click Element    BIR-module-button

BIR Values Update
	[Arguments] 	 ${value}
    Click Button     BIRUpdate
    Input Text       xpath=//table[@id="BIRTable"]/tbody/tr/td/input      ${value}
    Click Button     BIRSubmit